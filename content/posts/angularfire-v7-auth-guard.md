---
title: 'Angularfire V7 Auth Guard'
date: 2021-06-08
tags:
  - snippets
---

As of now, the AngularFire v7(**"Beta"**) does not have an implementation for an
auth guard(which I really need), so I went ahead, copied the original auth guard
code (from v6), and refactored it to make it compatible with v7.

**This code works on Angular 12. I haven't tested it for older versions, but it should work.**

Here's the code:

```ts
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire';
import { authState } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { User } from '@firebase/auth';
import { Observable, of, pipe, UnaryFunction } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

export type AuthPipeGenerator = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => AuthPipe;
export type AuthPipe = UnaryFunction<
  Observable<User | null>,
  Observable<boolean | string | any[]>
>;

export const loggedIn: AuthPipe = map((user) => !!user);

/**
 * Auth guard based on AngularFire v6 AngularFireAuthGuard.
 * Check out the v6 implementation here: https://git.io/JZOcy
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const authPipeFactory =
      (route.data.authGuardPipe as AuthPipeGenerator) || (() => loggedIn);
    return authState(this.auth).pipe(
      take(1),
      authPipeFactory(route, state),
      map((can) => {
        if (typeof can === 'boolean') {
          return can;
        } else if (Array.isArray(can)) {
          return this.router.createUrlTree(can);
        } else {
          return this.router.parseUrl(can);
        }
      })
    );
  }
}

export const canActivate = (pipe: AuthPipeGenerator) => ({
  canActivate: [AuthGuard],
  data: { authGuardPipe: pipe },
});

export const isNotAnonymous: AuthPipe = map(
  (user) => !!user && !user.isAnonymous
);
export const idTokenResult = switchMap((user: User | null) =>
  user ? user.getIdTokenResult() : of(null)
);
export const emailVerified: AuthPipe = map(
  (user) => !!user && user.emailVerified
);
export const customClaims = pipe(
  idTokenResult,
  map((idTokenResult) => (idTokenResult ? idTokenResult.claims : []))
);
export const hasCustomClaim: (claim: string) => AuthPipe = (claim) =>
  pipe(
    customClaims,
    map((claims) => claims.hasOwnProperty(claim))
  );
export const redirectUnauthorizedTo: (redirect: string | any[]) => AuthPipe = (
  redirect
) =>
  pipe(
    loggedIn,
    map((loggedIn) => loggedIn || redirect)
  );
export const redirectLoggedInTo: (redirect: string | any[]) => AuthPipe = (
  redirect
) =>
  pipe(
    loggedIn,
    map((loggedIn) => (loggedIn && redirect) || true)
  );
```

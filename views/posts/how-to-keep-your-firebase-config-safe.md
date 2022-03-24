---
title: 'How to Keep Your Firebase Project Safe and Secure from everyone'
description: This post discusses some steps to keep a
  Firebase project safe and secure.
date: 2020-12-18
tags: [firebase, security, webdev, opensource]
---

After doing a couple of open source Firebase projects (web apps, I mean), I feel
like I'm experienced\* enough to write this post. So if I say something wrong
here, kindly let me know here.

# Why is this necessary?

I have a secret here(not really, just some people don't know about it). **Your
Firebase config**, which you might have been wondering where to hide, **is
publicly visible**(if you use Firebase hosting). Don't believe me? Go to the
index page any site which uses Firebase hosting, and just append
"/\_\_/firebase/init.js" (eg. `someapp.web.app/__/firebase/init.js`) and visit
it, and you'll remain surprised by the result. This is something which is not
discovered by me, its actually written in the
[documentation](https://firebase.google.com/docs/hosting/reserved-urls).

# Protecting your project

## Firestore datastore and Firebase Storage

This is perhaps the most important part of your backend which possibly contains
sensitive data, which must be protected and it might cause harm when in the
hands of bad people. So how to protect these? Well, here are some steps:

### "Start in production mode"

When setting up Firestore and storage, you might get asked whether to start the
resource in production mode or test mode. So always choose "Production mode" /
"Locked mode". The reason is that this mode introduces some security rules that
will block access from every client. Don't fear though, we can still change
them.

### Configure [security rules](https://firebase.google.com/docs/rules)

Security rules are very great to have. Using these, you can decide who can have
access to data and who cannot. These are written in .rules files and have a
similar syntax to JavaScript which can be understood in the docs. Since we used
production mode, you will see this particular rule in your security rules:

```
match /{document=**} {
    allow read, write: if false;
}
//Don't remove this rule, or else your project is gone
//and keep this rule at end (this comment is added by me)
```

Which literally means that no client can access your database and storage, which
is sometimes not needed. So we can introduce changes in how we store data. If
you've used Firebase, you know that for every user that signs up for your app,
they are assigned a unique ID (or UID). We can store resources based on their
UID, for example, in a todo app, one can store user's data in their database at
path `/todos/users-uid` which makes sense. So in this, we can add a new rule:

```
match /todos/{uid=\*\*} {
allow read, write: if request.auth != null and request.auth.uid == uid;
}
```

This means that if anyone accesses any path under todos collection, they should
be authenticated to the app, and if they try to access a specific UID in the
collection, the database will only allow access if they access data under their
UID. Do the same for Firebase storage as well.

### Use seperate API keys if they are used only for one purpose

Suppose you are also developing a CLI for your app ([which I am
doing](https://github.com/obnoxiousnerd/lookahead)), you might need your API key
for refreshig the user's JWT (which I am doing :) ). So just don't use the same
Firebase config API key, create a new one which has only access to the things we
need, in this case, we need access to the Token Service API. So you can move to
the [Google APIs dashboard](https://console.developers.google.com/), and then
select your preferred project.

1. When you're in the dashboard, go to the 'Credentials' section.

   ![](https://i.imgur.com/uocb2U3.png)

2. Then in the top app bar, click the "Create Credentials" button. A drop down
   will appear. Select "API key"

3. Then it will show a dialog like this:

   ![](https://i.imgur.com/os9Ptgt.png)

4. Then that key will appear in the "Keys" section. Then, in that list, find the
   API key we just created, and then click on the pencil icon.

5. Scroll down and you'll find a section "API restrictions". Select the option
   "Restrict key".

6. Then a dropdown will appear with text "Select APIs". Then select the services
   which you want the API key to be working with. I'll select the Token Service
   API here.

   ![](https://i.imgur.com/DOWZTMi.png)

7. Just hit the "Save" button.

Then in the keys' section, you'll find that the API key has a green check on it.
It means that it is now secure and you'll bear less damage if it got leaked.

### If you need to have your API keys in your repo

If your code is public, and you need your API keys for testing or just to keep
everything modular and smooth, encrypt it and then save it. I also use a similar
approach in my CLI app, beacuse I need it for CI. You can use any encryption
method which uses public-private key pair and then store the encrypted file in
your repo and then decrypt it whenever needed.

### Respect Firebase server credentials

Now this is important. We've been talking about the general Firebase config
which we add in our web apps, but now, I'm talking about server credentials,
which are used by the Admin SDKs. These are allowed access everywhere; no one
can deny them. So treat them with respect and keep them as a secret only, don't
show them off or else you're done.

# Ending thoughts

Good job if you've made it this far. Now you can just chill back and write some
code for your project. Always tell me if you got stuck in any of the steps. Have
a nice day :)

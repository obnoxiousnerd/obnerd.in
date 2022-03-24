---
title: 'Reactivity Anywhere Without Virtual Dom'
description: "This little experiment gives variables 'superpowers' to be able to reflect their changes directly into the DOM."
date: 2020-11-20
tags: [javascript, html, webdev, reactivity]
---

# How did this got into my mind??

Virtual DOM can be referenced as the thing which just "introduced" me to the
title of this post. What if we keep aside all that diffing, state stuff, and
focus on one thing: reactivity between the JavaScript and the DOM. Well, most of
us are using libraries just to achieve this reactivity in our apps. But most of
them implement a virtual DOM which keeps track of all the tags, states,
variables, objects, and whatnot and then syncs them with the real DOM. As said,
things might get a little crazy doing all this stuff. So I just decided, why not
just implement a crude example of all this "virtual DOM" thing without virtual
DOM. Is this even achievable?? The answer is (0.5 \* yes)!! For the sake of this
post, let us call it "Reactivity Anywhere."

# Disclaimer

This post might have things that seem vague and senseless. Also don't take
things too seriously here, take them as just a thought. Reader discretion is
advised.

# Let's Start!!

## Prerequisites

- A web browser
- JavaScript

# Defining the global variables(precisely, stores)

To keep track of what goes here and there, we need some global variables to
preserve and mutate all the states.

```js
const __refs__ = {};
const __reactives__ = [];
const __reactiveEl__ = document.querySelectorAll('[reactive]');
const reactive = (obj) => {
  /*Add logic*/
};
const __updateDOM__ = (ref) => {
  /*Add logic*/
};
```

This is just everything we need for the logic. The variables whose names start
and end with double underscores are
[internals](https://github.com/facebook/react/blob/3ebf05183dfcb8eadfc41a9e19559d835fd9b77e/packages/react/index.js#L71).
We will only store two things: references to the elements, and, of course, the
reactive variables.

## But this seems like virtual DOM!!!

But I'm sorry, this is not the virtual DOM you think:

- We will not be diffing the whole element tree for every single change; only
  and only the affected element will be mutated (less carbon dioxide)

# Determining `reactive` elements

To keep specificity and refrain from scanning the whole DOM, we will just
handpick special elements that work with our module. So, any element that has
the `reactive` attribute (`<element reactive></element>`), will only be able to
use the special reactive powers.

To access the reactive elements from the store, we will use the ES6 string
interpolation syntax. So, to access the `count`, we will write

```html
<h1 reactive>The time is ${count}</h1>
```

# The `__refs__`

Here, we will store the values of the object passed in the `reactive` function.

# The `__reactives__`

This is just an array containing live references of the DOM Elements.

# The `reactive()`

This function is basically a store where you'd be storing all the reactive
stuff. The definition of the function is surprisingly simple:

```js
const reactive = (obj) => {
  // Loop through the string
  Object.keys(obj).forEach((key) => {
    // defineProperty, anyone??
    // We want to maintain reactivity, so we are using custom
    // getters and setters
    Object.defineProperty(__refs__, key, {
      get() {
        return obj[key];
      },
      // This shows an interesting aspect of the logic.
      // This will update the target element everytime
      // something changes.
      set(val) {
        obj[key] = val;
        __updateDOM__(key);
      },
    });
    // Think of this as an initial render
    __updateDOM__(key);
  });
  // This is an important step otherwise
  // everything is useless
  return __refs__;
};
```

# The `__updateDOM__()`

This is the
[Rosetta](<https://en.wikipedia.org/wiki/Rosetta_(software)#:~:text=Rosetta%20is%20a%20dynamic%20binary%20translator%20developed,application%20compatibility%20layer%20between%20different%20CPU%20architectures>)
for the `reactive` DOM Elements and the `__refs__`. This function is also
relative simple in its definition:

```js
// Ref can be any key from the __refs__ store
const __updateDOM__ = (ref) => {
  // This is to check whether we want to update a specific ref value
  if (ref) {
    __reactives__
      // filter out the elements we need
      .filter((reactive) => reactive.dataset.ref === ref)
      .forEach((reactive) => {
        let ref = reactive.dataset.ref;
        // Interacting with the DOM
        // Nullish coalescing, anybody?
        reactive.textContent = __refs__[ref] ?? '';
      });
  }
  // UPDATE ALL!!
  else
    __reactives__.forEach((reactive) => {
      let ref = reactive.dataset.ref;
      // Interacting with the DOM
      // Nullish coalescing, anybody?
      reactive.textContent = __refs__[ref] ?? '';
    });
};
```

# Finding all the reactive variables and bootstrapping them

This can be wrapped as an IIFE (Immediately Invoked Function Expression) but I
don't consider doing it for the sake of simplicity. So, here we go!!

```js
// Get live elements
const __reactiveEl__ = document.querySelectorAll('[reactive]');
__reactiveEl__.forEach((el) => {
  // Match the `count` between <h1 reactive>${count}</h1>
  const refs = el.innerHTML.match(/\${([^}]+)}/g);
  // If the refs exist
  if (refs) {
    refs.forEach((ref) => {
      // extract it
      const dataRef = ref.split('{')[1].split('}')[0].trim();
      // insert a special span element with the element
      // and store the key name in the `data-ref` attribute
      el.innerHTML = el.innerHTML.replace(
        ref,
        `<span class="reactivity-anywhere" data-ref="${dataRef}"></span>`
      );
    });
    // Push the span element in __reactives__
    __reactives__.push(...el.querySelectorAll('span.reactivity-anywhere'));
  }
});
// Initialize all the magic!!
__updateDOM__();
```

# Making `<input>` and `<textarea>` work with reactives

Of course, we need this if user input is needed for our code to run.

The supercharged textareas and input elements will bear the `ref` attribute

A lot of things, harsh things are going to be done in this section, so brace
yourself and hold on tight.

```js
const parseDefaultRefValue = (el) => {
  let parsed = null;
  try {
    // If the passed key is a function, run it
    // and store the value
    // I'm sorry, but we need to use eval here
    parsed = eval(`(${el.getAttribute('ref-default')})()`);
  } catch (e) {
    parsed = el.getAttribute('ref-default');
  }
  return parsed;
};
const assignDefaultRefsToInputs = (el, ref) => {
  __refs__[ref] = parseDefaultRefValue(el);
};
// Select input and textarea elements containing the
// 'ref' attribute, where the attr. value refers to any
// key in the __refs__ store.
// The `ref-default` contains the default value for the `ref`
// eg.
// <textarea ref="name"></textarea>
document.querySelectorAll('input[ref], textarea[ref]').forEach((el) => {
  // Keep a ref to the ref!! Because we don't want to
  // lose it in event listeners
  const ref = el.getAttribute('ref');
  if (ref) {
    // lazily update default values
    window.addEventListener('load', () => assignDefaultRefsToInputs(el, ref));
    el.addEventListener('input', () => {
      // again, a dumb reference to the ref
      const elRef = ref;
      // preserve default value
      const defaultVal = parseDefaultRefValue(el);
      // Set whatever value is typed as the ref value
      // else, the default value
      __refs__[elRef] = el.value !== '' ? el.value : defaultVal;
      if (__refs__[elRef] !== defaultVal) {
        // Keep rest of the input/textarea elements in sync
        Array.from(document.querySelectorAll('input[ref], textarea[ref]'))
          // Find input/textareas with same refs
          .filter((el) => el.getAttribute('ref') === elRef)
          // Keep their value in sync
          .forEach((el) => (el.value = __refs__[elRef]));
      }
    });
  }
});
```

# We're almost done!

Now the only thing that remains is to write some HTML to check whether
everything works! So, here we go!! Some more things to note here:

- You can use multiple stores!! However, if you redeclare a key in the latter
  store, it will take precedence, not the first one

<!-- <Codepen slug="wvWbNqo" title="Reactivity Anywhere!!" result="result" height="500"/> -->

# Why something like this would be great to use (according to me)

- It will allow HTML to do its work and JS to do its own. It's not like "All
  HTML!" or "All JS!" but harmony between the two (not to mention CSS here) that
  will appreciate the job these languages have to do.
- Minimal overhead. As I said earlier, no virtual DOM, only real DOM (credits to
  [Svelte](https://svelte.dev)) with some objects in memory

# Limitations

You're going to think over this :) because this is just a crude implementation
of an idea. So, feel free to critically think over it.

# Ending notes

If you seem to be interested in creating some sort of framework with this,
you're ready to go (some frameworks, using this idea, might even exist)! I'd
also be happy to help you! Thank you for bearing with me in such a long post!

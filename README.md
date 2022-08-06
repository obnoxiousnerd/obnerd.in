My personal site rewritten in 11ty.

Some of the 11ty setup shamelessly copied from [Evan's site setup](https://git.sr.ht/~boehs/site/tree/master/item/src/package.json)

Iosevka minimal was subsetted from the original font using this:

```
# Referred from https://markoskon.com/creating-font-subsets/
pyftsubset iosevka-custom-regular.woff2 --flavor=woff2 --unicodes="U+0000-00FF,U+20B0-02FF,U+2000-206F,U+2070-209F,U+2200-22FF,U+2500-257F,U+2580-259F"
```

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
# Continui

A library to easily implement the continuous integration and delivery/deploy on any platform for any language. Powered with `typescript` allowing you to write and consume strongly typed implementations which make easy the development and consumption.

# How it works?

`Continui` is basically an application that orchestrates the actions and validations to be made in order to continuously integrate, deploy/deliver your software. 

With `continui` you got the total control of the steps `(actions)` to be made in order to execute you CI/CD pipeline, this argument is based in the fact that each `continui` action is meant to do just one thing which also means that you can:

- Control in a very granular way what to do and when to do it.
- Validate if an action can be executed AOT (Ahead of Time) with `continui`'s checkers
- Rollback executed actions if any of the actions fail, allowing the automatic rollback and restore of the distributions in case of any failure.

Also because `continui` has been built with the SOLID principles in mind, the application is `open-close` allowing you to extend the application by implementing your own version of the services if they don't fully satisfy your needs, this could be done without modifying the `continui`s code, also you can `inverse the dependencies` by injecting those services into your own implementations.

> To learn more about how `continui` is built, how is composed and how to extend it visit **[Continui Domain](packages/@continui/domain)**

# Usage

> TODO
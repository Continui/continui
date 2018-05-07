> **Note** This package does not contain any functional code, is intended to contain only the domain abstraction that defines `continui` expected,  available and overridable behavior. Please just directly dependent on this package if you are intending to extend `continui`'s functionality or want to consume it.

# Continui Domain

A package that contains the domain abstractions for the `continui`'s actions, checkers and services.


# Overview

If you are here, you may are wanting to create a new `continui`'s action or checker, if not, you're planning to override it services with your own logic.

If the answer is none of those, then, what are you doing here?

Anyways basically `continui` without it's actions, checkers and services, is just nothing, so let's see what those concepts are and what they mean in the `continui`'s world.

# Concepts

## Actions

Are specific actions you want to make against or with the source code and/or generated artifacts these actions can be as simple as a git operation just like commit, push and tag or take your generated artifacts and upload them to the clouds providers or a packages registries.

### Action characteristics

  1. #### Automaticaly reversible
      Actions rollback itself if it or any action in the CI/CD pipeline fails, allowing the automatic rollback and restore of the distributions in case of any failure.

  2. #### Has a single responsability
      Actions are meant to do just one thing, it means you should let the consumer decide how things should occur in their pipelines. 
        
      > Eg. You should not create an action that commits something in git and at the same time push it to a remote git repository. consumers must decide when to commit and when to push.

### Checkers

Are validations that must be made before an action to be executed, unlike the actions, checkers doesn't exist to make any changes in the contexts in which they are running instead they exist to answer a yes-no checker.

> Eg. A checker could be one that tells you if there are changes in the repository or if the current version is already deployed somewhere, then depending on the answer you decide to proceed or not with the action execution.

### Services

Are common services userd by `continui` and we think they can be util for your actions and checker to be exected, basically are services for logging, execute shell commands, etc..., because `continui` has been built with the SOLID principles in mind, the application is `open-close` allowing you to extend the application by implementing your own version of the services if they don't fully satisfy your needs, this could be done without modifying the `continui`s code, also you can `inverse the dependencies` by injecting those services into your own implementations.

#### Available Services

Name | Description
-----| -----------
Shell Command Execution | Allows execute shell commands
Logging | Allows log application data 
Text Securing | Allows secure the application text content
Text Templating | Allows the use and parse of templates for text inputs

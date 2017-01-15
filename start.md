---
title: "Getting Started"
layout: page
---

# Getting Started

Facility is primarily for new APIs. Design a Facility Service Definition (FSD) for your API and then leverage various tools and libraries to implement, document, and consume your API. The [Facility Editor](/editor) is a great way to experiment with API ideas and preview the client and server code that would be generated.

Facility can be used for existing APIs by creating and using an FSD that reflects that API. However, it is reasonably likely that an existing API will use features that aren't supported by Facility, especially since a limited feature set is one of the [design goals](/why) of Facility.

## Design Your API

* Encode the [service definition](/define) of your API as an FSD file.
* Determine how your API will use JSON over HTTP, adding attributes to your FSD file as needed.
* Document your API with summary comments and Markdown remarks in your FSD file.

## Use Your API

* Use [code generation](/generate) (e.g. via the [Facility Editor](/editor)) to generate server code, client code, and Markdown documentation.

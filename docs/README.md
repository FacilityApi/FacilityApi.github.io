---
sidebar_label: Introduction
sidebar_position: 1
---

# Facility API Framework

Design, implement, consume, and document APIs with tools and libraries that work with simple API definitions.

## Design

Use the [Live Editor](/editor) or any text editor to design your API using the simple [FSD format](./define/fsd.md), or convert an [OpenAPI](./define/swagger.md) spec to FSD.

Each method of your API has a name and a corresponding HTTP path. Clients POST the JSON request and receive a JSON response. Make your API less RPC-ish and more RESTful by adding [attributes](./define/fsd.md#attributes) to your FSD methods and data fields.

Commit your API definition to source control for revision tracking and peer review. Run [command-line tools](./generate/index.md) from your automated builds to validate the syntax and ensure that generated code and documentation stays up-to-date.

## Implement

Facility [generates a C# interface](./generate/csharp.md) with one method for each method of your API.

You write a C# class that implements that interface and then [integrate that class](./generate/aspnet.md) into an ASP.NET app. Facility takes care of the HTTP mapping so you can focus on the implementation logic.

Your C# class is easily unit tested, encourages good separation of concerns, and is more flexible than a hand-coded controller. Edit the FSD and regenerate the code to rapidly add new features to your API.

Alternatively, [convert your FSD to OpenAPI](./define/swagger.md) and find support for your favorite API framework among the many [supported tools](https://swagger.io/tools/).

## Consume

Facility generates client libraries in [C#](./generate/csharp.md) and [JavaScript/TypeScript](./generate/javascript.md).

Publish to [NuGet](https://www.nuget.org/) and [npm](https://www.npmjs.com/) to make it easy for clients to use your API. The generated code is designed to avoid breaking changes even as your API evolves.

Do not repeat yourself: The C# client library and the server implementation use the same C# interfaces and classes. Generate TypeScript to leverage type information while maintaining JavaScript compatibility.

To build client libraries for other languages and frameworks, [convert your FSD to OpenAPI](./define/swagger.md) and use any of the [supported tools](https://swagger.io/tools/).

## Document

[Generate Markdown documentation](./generate/markdown.md) for your API.

Push the documentation to [GitHub](https://github.com/) for easy reading at your GitHub repository, or use the Markdown support of [GitHub Pages](https://pages.github.com/) to display the documentation on your project website.

You can also [convert your FSD to OpenAPI](./define/swagger.md) and use [Swagger UI](https://swagger.io/swagger-ui/).

# JavaScript/TypeScript Support

Facility supports tools and libraries for using [JavaScript](https://en.wikipedia.org/wiki/JavaScript) and/or [TypeScript](https://www.typescriptlang.org/) with Facility Service Definitions.

## Tools

Generate a JavaScript or TypeScript client or server for your [Facility Service Definition](/define) by doing one of the following:

* Use the [Facility Editor](/editor). Enter an API definition in the left pane, choose the "JavaScript" or "TypeScript" generator, review the generated files, and click Download.
* Run the [`fsdgenjs`](#fsdgenjs) tool on the command line or in a build script.
* Use the `Facility.CodeGen.JavaScript` .NET library ([NuGet Package](https://www.nuget.org/packages/Facility.CodeGen.JavaScript)) in your own build tool.

## fsdgenjs

`fsdgenjs` is a command-line tool that generates JavaScript or TypeScript for a Facility Service Definition.

Install `fsdgenjs` [as documented](/generate/tools#installation) from its [NuGet package](https://www.nuget.org/packages/fsdgenjs/).

`fsdgenjs` generates files for client, Express server, and types and supports the [standard command-line options](/generate/tools#options) as well as the following additional command-line options:

* `--module <name>`: Sets the name of the generated module.
* `--typescript`: Generates TypeScript rather than JavaScript.
* `--express`: Generates an [Express](http://expressjs.com) server.
* `--disable-eslint`:  Disables ESLint via code comment.

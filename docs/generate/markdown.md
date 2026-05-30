# Markdown Support

Facility supports tools for generating [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/) from Facility Service Definitions.

## Tools

Generate Markdown for your [Facility Service Definition](/define/fsd) by doing one of the following:

* Use the [Facility Editor](/editor). Enter an API definition in the left pane, choose the "Markdown" generator, review the generated files, and click Download.
* Run the [`fsdgenmd`](#fsdgenmd) tool on the command line or in a build script.
* Use the `Facility.CodeGen.Markdown` .NET library ([NuGet Package](https://www.nuget.org/packages/Facility.CodeGen.Markdown)) in your own build tool.

## fsdgenmd

`fsdgenmd` is a command-line tool that generates Markdown for a Facility Service Definition.

Install `fsdgenmd` [as documented](/generate/tools#installation) from its [NuGet package](https://www.nuget.org/packages/fsdgenmd/).

`fsdgenmd` generates multiple Markdown files and supports the [standard command-line options](/generate/tools#options) as well as the following additional command-line options:

* `--nohttp`: Omits HTTP documentation.

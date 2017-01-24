# ASP.NET Support

Facility supports tools and libraries for using [ASP.NET](https://www.asp.net/) with Facility Service Definitions.

## Tools

Generate an ASP.NET controller for your [Facility Service Definition](/define) by doing one of the following:

* Use the [Facility Editor](/editor). Enter an API definition in the left pane, choose the "ASP.NET Web API" generator, review the generated files, and click Download.
* Run the [`fsdgenaspnet`](#fsdgenaspnet) tool on the command line or in a build script.
* Use the `Facility.CodeGen.AspNet` .NET library ([NuGet Package](https://www.nuget.org/packages/Facility.CodeGen.AspNet)) in your own build tool.

## fsdgenaspnet

`fsdgenaspnet` is a command-line tool that generates C# for a Facility Service Definition.

Install `fsdgenaspnet` [as documented](/generate/tools#installation) from its [NuGet package](https://www.nuget.org/packages/fsdgenaspnet/).

`fsdgenaspnet` generates an ASP.NET controller in the output directory. It supports the [standard command-line options](/generate/tools#options) as well as the following additional command-line options:

* `--namespace <name>`: Sets the namespace used by the generated ASP.NET controller.
* `--apinamespace <name>`: Sets the namespace that was used by the [C# code generator](#csharp).

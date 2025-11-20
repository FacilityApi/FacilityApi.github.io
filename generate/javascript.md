# JavaScript/TypeScript Support

Facility supports tools and libraries for using [JavaScript](https://en.wikipedia.org/wiki/JavaScript) and/or [TypeScript](https://www.typescriptlang.org/) with Facility Service Definitions.

## Tools

Generate a JavaScript or TypeScript client or server for your [Facility Service Definition](/define/fsd) by doing one of the following:

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

## Events

[Events](/define/fsd#events) in Facility enable streaming responses using server-sent events (SSE). The JavaScript/TypeScript code generator produces methods that return async iterables for events.

For an event defined as:

```fsd
event streamChat
{
  prompt: string;
}:
{
  textDelta: string;
}
```

The generated TypeScript client includes:

```typescript
streamChat(
  request: IStreamChatRequest
): Promise<IServiceResult<AsyncIterable<IServiceResult<IStreamChatResponse>>>>;
```

### Using Events in JavaScript/TypeScript

Clients can consume event streams using `for await...of`:

```typescript
const request = { prompt: "Hello" };
const result = await client.streamChat(request);

if (!result.ok) {
  // Handle error
  console.error(`Error: ${result.error.message}`);
  return;
}

for await (const chunkResult of result.value) {
  if (!chunkResult.ok) {
    // Handle error in stream
    console.error(`Stream error: ${chunkResult.error.message}`);
    break;
  }
  
  const chunk = chunkResult.value;
  process.stdout.write(chunk.textDelta);
}
```

The HTTP client implementation uses the Fetch API to consume server-sent events with all HTTP methods supported, automatically parsing each SSE event into a response object.

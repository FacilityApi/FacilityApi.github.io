# Facility Service Definition

A Facility Service Definition (FSD) describes the operations supported by a Facility API.

Unlike other API definition formats, an FSD focuses on the shape of the client library rather than on the HTTP paths. Each service operation has a name, request fields, and response fields. In that way it resembles [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) more than [REST](https://en.wikipedia.org/wiki/Representational_state_transfer), though it can certainly be used to describe RESTful APIs.

You can also use [OpenAPI 2.0 (aka Swagger)](https://swagger.io/) by using a tool to [convert an API in that format](/define/swagger) to/from an FSD.

## FSD File

A Facility Service Definition is represented by an FSD file.

An FSD file uses a domain-specific language in an effort to make Facility Service Definitions easier to read and write, especially for developers comfortable with C-style languages.

Each FSD file contains the definition of one **service**. The name of an FSD file is typically the service name with an `.fsd` file extension, e.g. `MyApi.fsd`.

An FSD file is a text file encoded with UTF-8 and no byte order mark (BOM).

### Service

Every service has a **name**. Unless otherwise noted, a name in this specification must start with an ASCII letter but may otherwise contain ASCII letters, numbers, and/or underscores.

A service contains one or more service elements: [methods](#methods), [data transfer objects](#data-transfer-objects), [enumerated types](#enumerated-types), and [error sets](#error-sets). A service can also have [attributes](#attributes), a [summary](#summary), and [remarks](#remarks).

#### Service FSD

In an FSD file, the `service` keyword starts the definition of a service. It is followed by the service name and optionally preceded by service attributes.

The methods and other service items follow the service name, enclosed in braces.

```fsd
[http(url: "https://api.example.com/v1/")]
[info(version: 2.1.3)]
service MyApi
{
  method myMethod { … }: { … }
  data MyData { … }
  enum MyEnum { … }
  …
}
```

It is also possible to omit the curly braces around the service members and instead use a semicolon after the service name.

```fsd
[http(url: "https://api.example.com/v1/")]
[info(version: 2.1.3)]
service MyApi;

method myMethod { … }: { … }
data MyData { … }
enum MyEnum { … }
…

```

#### Service HTTP

The `url` parameter of the `http` attribute indicates the base URL where the HTTP service lives. The trailing slash is optional. If the attribute or its parameter is omitted, the client will have to provide the base URL.

#### Service Info

If desired, use the `version` parameter of the `info` attribute to indicate the version of the API.

### Attributes

Attributes are used to attach additional information to a service and its elements.

Each attribute has an alphanumeric **name** and may optionally include one or more **parameters**. Each parameter has its own **name** as well as a **value**.

The `obsolete` attribute indicates that the service element is obsolete and/or deprecated and should no longer be used. The optional `message` parameter can be used to provide additional information, e.g. what should be used instead.

#### Attributes FSD

In an FSD file, the attribute name is surrounded by square brackets. The comma-delimited parameters, if any, are surrounded by parentheses and follow the attribute name.

Each parameter value can be represented as an ASCII token or a [JSON-style](https://www.json.org/) double-quoted string. An ASCII token can consist of numbers, letters, periods, hyphens, plus signs, and/or underscores. An ASCII token is not semantically different than a double-quoted string containing that token.

```fsd
[obsolete] // no parameters
[csharp(name: query)] // one parameter
[http(path: "/search", code: 202)] // two parameters
```

Multiple attributes can be comma-delimited within one set of square brackets (as below) and/or specified in separate sets of square brackets (as above).

```fsd
[obsolete, csharp(name: query)]
```

#### Attribute HTTP

Every Facility API has a default HTTP mapping. The HTTP mapping can be customized by using the `http` attribute, which can be applied to services, methods, request fields, response fields, and errors.

The `http` attribute is always optional. When the attribute is omitted, the defaults are used, as documented.

### Methods

Each method represents an operation of the service.

A method has a **name**, **request fields**, and **response fields**. A method can also have [attributes](#attributes), a [summary](#summary), and [remarks](#remarks).

When a client invokes a service method, it provides values for some or all of the request fields. For example, a translation service could have a `translate` method with request fields named `text`, `sourceLanguage`, and `targetLanguage`.

If the method succeeds, values are returned for some or all of the response fields. A `translate` method might return the translated text in a `text` field and a confidence level in a `confidence` field.

If the method fails, a [service error](#service-errors) is returned instead.

#### Method FSD

In an FSD file, the `method` keyword starts the definition of a method. It is followed by the method name and optionally preceded by method attributes.

The request and response follow the method name, each enclosed in braces and separated by a colon (`:`). The request and response fields, if any, are listed within the braces.

```fsd
  method translate
  {
    text: string;
    sourceLanguage: string;
    targetLanguage: string;
  }:
  {
    text: string;
    confidence: double;
  }
```

#### Method HTTP

The `http` attribute of a method supports a parameter named `method` that indicates the HTTP method that is used, e.g. `GET`, `POST`, `PUT`, `DELETE`, or `PATCH`. If omitted, the default is `POST`. Lowercase is permitted, e.g. `[http(method: get)]`.

The `path`  parameter indicates the HTTP path of the method (relative to the base URL). The path must start with a slash. A single slash indicates that the method is at the base URL itself.

For example, if a method uses `[http(method: GET, path: "/widgets"]` in a service that uses `[http(url: "https://api.example.com/v1/"]`, the full HTTP method and path for that method would be `GET https://api.example.com/v1/widgets`.

If the `path` parameter is not specified, it defaults to the method name, e.g. `/getWidgets` for a method named `getWidgets`. This default would not be appropriate for a RESTful API, but may be acceptable for an RPC-style API.

The `code` parameter indicates the HTTP status code used if the method is successful (but see also [body fields](#body-fields) below). If omitted, it defaults to `200` (OK). If `code` is set to `204` (No Content) or `304` (Not Modified), no content is returned and [normal fields](#normal-fields) are prohibited.

```fsd
  [http(method: POST, path: "/jobs/start", code: 202)]
  method startJob
  {
    …
  }:
  {
    …
  }
```

### Events

Events are similar to methods but support streaming responses. Instead of returning a single response, an event returns a stream of response chunks over time, enabling server-sent events (SSE) style communication.

Like methods, each event has a **name**, **request fields**, and **response fields**. Events can also have [attributes](#attributes), a [summary](#summary), and [remarks](#remarks).

When a client invokes an event, it provides request field values just like a method. However, unlike a method that returns a single response, an event returns a stream where each item is a complete response DTO. The stream can yield multiple responses over time until it completes.

In C#, events return `Task<ServiceResult<IAsyncEnumerable<ServiceResult<TResponse>>>>`, allowing clients to process responses as they arrive using `await foreach`. Other languages provide similar async iterable constructs.

#### Event FSD

In an FSD file, the `event` keyword starts the definition of an event. It is followed by the event name and optionally preceded by event attributes.

The request and response follow the event name, each enclosed in braces and separated by a colon (`:`). The syntax is identical to methods, but the response represents a single chunk of data rather than the entire response.

```fsd
/// Generates the next message in a chat.
event chatStream
{
  settings: ChatSettings;
  messages: ChatMessage[];
}:
{
  messages: ChatMessage[];
  status: ChatStatus;
  usage: ChatUsage;
}
```

#### Event HTTP

The `http` attribute works the same for events as for methods. Events support the `method` and `path` parameters.

The `method` parameter indicates the HTTP method to use, typically `POST` (the default). The `path` parameter specifies the HTTP path, defaulting to the event name with a leading slash (e.g., `/chatStream`).

Events always use server-sent events (SSE) for the response, with `Content-Type: text/event-stream`. The HTTP response uses status code `200` and keeps the connection open to stream multiple response DTOs as separate SSE events.

```fsd
[http(method: POST, path: "/chat/stream")]
event chatStream
{
  settings: ChatSettings;
  messages: ChatMessage[];
}:
{
  messages: ChatMessage[];
  status: ChatStatus;
  usage: ChatUsage;
}
```

#### Events vs Methods

**Methods** return a single response (or error) and then complete. They are ideal for traditional request-response operations.

**Events** return a stream of responses, allowing progressive updates. Each response in the stream is a complete response DTO. Events are ideal for:

* Long-running operations with progress updates
* Streaming AI/LLM responses where tokens are generated incrementally
* Real-time data feeds that push updates to clients
* Incremental results where partial data is useful before completion

#### Response Streaming Behavior

When an event is invoked:

* The server establishes an HTTP connection with server-sent events (SSE)
* The server yields multiple response chunks over time
* Each chunk is a complete response DTO, serialized and sent as an SSE event
* Clients can process chunks as they arrive, enabling progressive rendering
* The stream completes when the server finishes sending data
* Errors can be returned at any point in the stream using the `ServiceResult` wrapper

#### Event Example

Here's a practical example showing how events are used for streaming AI chat responses:

```fsd
service ChatApi
{
  /// Streams chat response tokens as they're generated.
  event streamChat
  {
    /// The user's prompt
    prompt: string;
    
    /// The model to use (optional)
    model: string;
  }:
  {
    /// Text delta to append to response
    textDelta: string;
    
    /// Completion status (sent in final chunk)
    status: CompletionStatus;
    
    /// Token usage statistics (sent in final chunk)
    usage: UsageInfo;
  }
}

data UsageInfo
{
  inputTokens: int32;
  outputTokens: int32;
}

enum CompletionStatus
{
  /// Response completed successfully
  complete,
  
  /// Response was truncated
  truncated,
  
  /// An error occurred
  error,
}
```

In this example, the server would stream multiple responses:
* Initial chunks contain `textDelta` with generated text fragments
* Intermediate chunks may include additional `textDelta` values
* The final chunk includes `status` and `usage` to indicate completion

### Fields

A field stores data for a method request, method response, or data transfer object.

Each field has a **name** and a **type**. The field type restricts the type of data that can be stored in that field.

Fields are generally optional, i.e. they may or may not store a value.

The following primitive field types are supported:

* `string`: A string of zero or more Unicode characters.
* `datetime`: An ISO 8601 UTC datetime string with an uppercase `T`, `Z`, no fractional seconds, and no time offset.
* `boolean`: A Boolean value, i.e. true or false.
* `float`: A single-precision floating-point number.
* `double`: A double-precision floating-point number.
* `int32`: A 32-bit signed integer.
* `int64`: A 64-bit signed integer.
* `decimal`: A 128-bit number appropriate for monetary calculations.
* `bytes`: Zero or more bytes.
* `object`: An arbitrary JSON object.
* `error`: A [service error](#service-errors).

A field type can be any [data transfer object](#data-transfer-objects) or [enumerated type](#enumerated-types) in the service, referenced by name.

A field type can be an array, i.e. zero or more ordered items of a particular type, including primitive types, data transfer objects, enumerated types, or service results. Use `T[]` to indicate an array; for example, `int32[]` is an array of `int32`.

A field type can be a dictionary that maps strings to values of a particular type, including primitive types, data transfer objects, enumerated types, or service results. Use `map<T>` to indicate a map; for example, `map<int32>` is a map of strings to `int32`.

A field type can be a [service result](#service-results). Use `result<T>` to indicate a service result; for example, `result<Widget>` is a service result whose value is a DTO named `Widget`.

A field type can be nullable, i.e. can distinguish being unspecified from being explicitly null. (Normally, null is not permitted, or is treated the same as unspecified.) Use `nullable<T>` to indicate a nullable type; for example, a `nullable<bool>` field can be unspecified, null, true, or false.

#### Field FSD

In an FSD file, a field is represented by a name and a field type, which are separated by a colon (`:`) and followed by a semicolon (`;`). Fields can also be preceded by field attributes.

For fields whose type corresponds to a DTO or enumerated type, that DTO or enumerated type must be defined elsewhere in this service, before or after the method or DTO that contains the field.

#### Field JSON

Since [JSON](https://www.json.org/) is currently the most commonly-used serialization format for APIs over HTTP, Facility APIs are designed to be trivially compatible with JSON.

In a JSON request body, response body, or DTO, a field is serialized as a JSON object property. In fact, to avoid complicating implementations, there is no way to customize the JSON serialization of a request body, response body, or DTO. Each field is always serialized as a JSON property with the same name.

* `string`, `boolean`, `double`, `int32`, `int64`, and `decimal` are encoded as JSON literals.
* `datetime` is encoded as a `date-time` string as specified by [RFC 3339 §5.6](https://datatracker.ietf.org/doc/html/rfc3339#section-5.6), e.g. `2023-08-10T16:15:43Z`. It must use an uppercase `T`, an uppercase `Z`, no fractional sections, and no time offset. APIs that need more flexibility should use a `string` instead.
* `bytes` are encoded as a [Base64](https://en.wikipedia.org/wiki/Base64) string.
* `object` is encoded as a JSON object.
* `error` is encoded as a JSON object with `code`, `message`, `details`, and `innerError` properties.
* `result<T>` is encoded as a JSON object with a `value` or `error` property.
* `T[]` is encoded as a JSON array.
* `map<T>` is encoded as a JSON object.
* `nullable<T>` is encoded as an explicit `null` when null.

If a JSON property is set to `null`, it is treated as though it were omitted, unless the field type is `nullable<T>`. Arrays and maps are not permitted to have `null` items, unless they are arrays or maps of `nullable<T>`.

Even though `int64` is a 64-bit signed integer, avoid ±2<sup>51</sup> or larger, as JavaScript [cannot safely represent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) integers that large. Similarly, JavaScript numbers cannot accurately represent `decimal`.

When reading JSON, conforming clients and servers may match property names case-insensitively, and they may perform type conversions for property values, e.g. strings to numbers. They may also support non-standard JSON features, such as unquoted property names, single-quoted strings, comments, etc.

However, when writing JSON, conforming clients and servers must always use [standard JSON](https://www.json.org/) with no comments, correctly-cased property names, correctly-typed property values, etc.

#### Field Validation

Validation requirements for fields can be specified with the `validate` attribute. A client that sends an invalid field value in a request is likely to get an `InvalidRequest` error.

Types support appropriate parameters:

* string: `length` (the valid string lengths), `regex` (the pattern the string must match)
* numeric types: `value` (the valid field values)
* collection types: `count` (the valid number of elements in an array or map)
* enumerated types: none (used with no parameters to verify that the value is in the enumerated type definition)

Range syntax is supported for `length`, `value`, and `count` with `..`, e.g. `1..` (at least one), `..10` (at most ten), or `2..9` (between two and nine). Both boundaries are inclusive.

```fsd
data Person
{
  [validate(count: 1..)] // at least one
  emailAddress: string[];

  [validate(value: 0..120)] // at least zero, at most 120
  age: int32;

  address: Address;
}

data Address
{
  [validate(regex: "^[0-9]")] // start with a digit
  streetAddress: string;

  [validate(length: 2)] // exactly 2
  countryCode: string;
}

data PhoneNumber
{
  [validate] // only 'mobile', 'work', and 'home' are valid
  line: Line,

  [validate(regex: "^\\+[0-9]*$", length: 3..16)] // match regex and length
  number: string;
}

enum Line
{
  mobile,
  work,
  home
}
```

#### Field HTTP

On a request or response field, the `from` parameter of the `http` attribute indicates where the field comes from. It can be set to `path`, `query`, `body`, `header`, or `normal`. Like all `http` parameters, the `from` parameter is optional; see below for defaults.

The `http` attribute should not be used on a DTO field.

#### Path Fields

If `from: path` is used on a request field, the field comes from the HTTP path of the method, which must contain the field name in braces. (Response fields cannot be path fields.)

If the name of a request field without a `from` parameter is found in the path, it is assumed to be a path field, so `from: path` never needs to be used explicitly.

For example, a `getWidget` method might have a `/widgets/{id}` path and a corresponding `id` request field.

```fsd
  [http(method: GET, path: "/widgets/{id}")]
  method getWidget
  {
    id: string;
  }:
  {
    …
  }
```

#### Query Fields

If `from: query` is used on a request field, that field value comes from the query string of the HTTP request. (Response fields cannot be query fields.)

The `name` parameter of the `http` attribute can be used to indicate the name of the field as found in the query string; if omitted, it defaults to the field name.

If a request field of a `GET` or  `DELETE` method has no `from` value, it is assumed to be a query field. For other methods like `POST`, `from: query` is always needed to identify query fields.

The following example uses two query fields, e.g. `GET https://api.example.com/v1/widgets?q=blue&limit=10`.

```fsd
  [http(method: GET, path: "/widgets")]
  method getWidgets
  {
    [http(name: "q")] query: string;
    limit: int32;
  }:
  {
    …
  }
```

#### Body Fields

If `from: body` is used on a request or response field, the field value comprises the entire request or response body. The name of the field is not used in the actual HTTP request or response.

Only one request field may be marked as a body field, and the request must have no normal fields.

For response fields, the `code` parameter of the `http` attribute of the body field is used to indicate the HTTP status code used if the method is successful. If omitted, it defaults to `200` (OK).

In the response, multiple fields can use `from: body` to indicate multiple possible response bodies. Each field must use a different `code`.

The field type of a body field should generally be a DTO. A response body field can use `boolean` to indicate an empty response; when used, the field is set to `true`. The default `code` for a `boolean` body field is `204` (No Content).

```fsd
  [http(path: "/widgets")]
  method createWidget
  {
    [http(from: body)]
    widget: Widget;
  }:
  {
    [http(from: body, code: 201)]
    widget: Widget;

    [http(from: body, code: 202)]
    job: JobInfo;
  }
```

#### Header Fields

If `from: header` is used on a request or response field, the field is transmitted via HTTP header.

The `name` parameter of the `http` attribute can be used to indicate the name of the HTTP header; if omitted, it defaults to the field name.

The header value is not transformed in any way and must conform to the HTTP requirements for that header.

Headers commonly used by all service methods (`Authorization`, `User Agent`, etc.) are generally outside the scope of the FSD and not explicitly mentioned in each method request and/or response.

```fsd
  [http(method: GET, path: "/widgets/{id}")]
  method getWidget
  {
    id: string;

    [http(from: header, name: If-None-Match)]
    ifNotETag: string;
  }:
  {
    [http(from: header)]
    eTag: string;

    …
  }
```

#### Normal Fields

If `from: normal` is used on a request or response field, the field is a normal part of the request or response body.

Except as indicated above, request and response fields are assumed to be normal fields, so `from: normal` never needs to be used explicitly.

A method response may have both normal fields and body fields, in which case the set of normal fields is used by a different status code than any of the body fields.

Methods using `GET` and `DELETE` do not support normal fields.

```fsd
  [http(method: POST, path: "/widgets/search")]
  method searchWidgets
  {
    query: Query;
    limit: int32;
    offset: int32;
  }:
  {
    items: Widget[];
    more: boolean;
  }
```

#### Required Fields

Fields may be required via the `[required]` attribute, or by adding an exclamation point after the field type name. This attribute results in invalid requests if decorated fields are unspecified in request parameters.

```fsd
[http(method: POST, path: "/widgets")]
method createWidget
{
  name: string!; // ! is shorthand for [required]
}:
{
  id: int32;
}
```

Omitting a name will result in an invalid request error.

### Data Transfer Objects

Data transfer objects (DTOs) are used to combine simpler data types into a more complex data type.

Each data transfer object has a **name** and a collection of **fields**. A DTO can also have [attributes](#attributes), a [summary](#summary), and [remarks](#remarks).

#### DTO FSD

The `data` keyword starts the definition of a DTO. It is followed by the name of the DTO and optionally preceded by data attributes. The DTO fields follow the DTO name and are enclosed in braces.

```fsd
  data Widget
  {
    id: string;
    name: string;
  }
```

### Enumerated Types

An enumerated type is a type of string that is restricted to a set of named values.

An enumerated type has a **name** and a collection of **values**, each of which has its own **name**. An enumerated type can also have [attributes](#attributes), a [summary](#summary), and [remarks](#remarks).

The string stored by an enumerated type field should match the name of one of the values.

The value names of an enumerated type must be case-insensitively unique and may be matched case-insensitively but should nevertheless always be transmitted with the correct case.

#### Enum FSD

The `enum` keyword starts the definition of an enumerated type. It is optionally preceded by attributes.

The enumerated values are comma-delimited alphanumeric names surrounded by braces. A final trailing comma is permitted.

```fsd
  enum MyEnum
  {
    first,
    second,
  }
```

#### Enum JSON

Enumerated values are always transmitted as strings, not integers.

### External Types

External types enable the use of DTOs and enumerations defined in another service. This allows a data type to be defined once and then shared across multiple services.

External types do not require access to the definition of the target type. Code generators simply assume the data type will exist when the generated code is compiled or executed. It is the responsibility of the host project implementing the service to ensure any required references are resolved (for example, a C# project may add a reference to a NuGet package or another C# project containing the target data types).

The `extern` keyword starts the definition of an external type. It is followed by either `data` or `enum`, depending on the external type being referenced. This is followed by the name of the external type.

Attributes on the external type instruct code generators how to reference the data type in generated code.

```fsd
[csharp(namespace: Some.Project.Api.v1.Client)]
[js(module: "@example/some-project-api")]
extern data ExternalWidget;
```

### Service Errors

As [mentioned above](#methods), a failed service method call returns a service error instead of a response. A service error can also be stored in an `error` field, or in a failed `result<T>` field.

Each instance of a service error has a **code** and a **message**. It may also have **details** and an **inner error**.

The **code** is a machine-readable `string` that identifies the error. There are a number of standard error codes that should be used if possible:

* `InvalidRequest`: The request was invalid.
* `InternalError`: The service experienced an unexpected internal error.
* `InvalidResponse`: The service returned an unexpected response.
* `ServiceUnavailable`: The service is unavailable.
* `Timeout`: The service timed out.
* `NotAuthenticated`: The client must be authenticated.
* `NotAuthorized`: The authenticated client does not have the required authorization.
* `NotFound`: The specified item was not found.
* `NotModified`: The specified item was not modified.
* `Conflict`: A conflict occurred.
* `TooManyRequests`: The client has made too many requests.
* `RequestTooLarge`: The request is too large.

The **message** is a human-readable `string` that describes the error. It is usually intended for developers, not end users.

The **details** `object` can be used to store whatever additional error information the service wants to communicate.

The **inner error** is an `error` that can be used to provide more information about what caused the error, especially if it was caused by a dependent service that failed.

### Service Results

 A service result can be used in response fields by methods that perform multiple operations and want to return separate success or failure for each one.

 An instance of a service result contains exactly one of the following:

* **value**: a value of a [particular type](#fields) (success)
* **error**: a [service error](#service-errors) (failure)

### Error Sets

A service that needs to support non-standard error codes can define its own error set, which supplements the standard error codes.

Each error set has a **name** and a collection of **values**, each of which has its own **name**. An error set can also have [attributes](#attributes), a [summary](#summary), and [remarks](#remarks).

The name of each error set value represents a supported [error code](#service-errors).

The documentation summary of each error set value is used as the default error message for that error code.

#### Error Set FSD

The `errors` keyword starts an error set. It is followed by the name of the error set and optionally preceded by attributes.

The error values are comma-delimited alphanumeric names surrounded by braces. A final trailing comma is permitted.

#### Error Set HTTP

On an error of an error set, the `code` parameter of the `http` attribute is used to specify the HTTP status code that should be used when that error is returned, e.g. `404`.

If the `code` parameter is missing from an error, `500` (Internal Server Error) is used.

```fsd
  errors MyErrors
  {
    [http(code: 503)]
    OutToLunch
  }
```

The standard error codes already have reasonable HTTP status codes:

* `InvalidRequest`: `400`
* `InternalError`: `500`
* `InvalidResponse`: `500`
* `ServiceUnavailable`: `503`
* `Timeout`: `500`
* `NotAuthenticated`: `401`
* `NotAuthorized`: `403`
* `NotFound`: `404`
* `NotModified`: `304`
* `Conflict`: `409`
* `TooManyRequests`: `429`
* `RequestTooLarge`: `413`

### Comments

Use two slashes to start a comment. The slashes and everything that follows them on that line are ignored (except for [summaries](#summary)).

```fsd
  data MyData // this comment is ignored
  {
    name: string; // so is this
    // and this
  }
```

### Summary

Most elements of a service support a **summary** string for documentation purposes: service, methods, DTOs, fields, enumerated types, enumerated type values, error sets, and error set values.

The summary should be short and consist of a single sentence or short paragraph.

#### Summary FSD

To add a summary to a service element, place a comment line before it that uses three slashes instead of two. Multiple summary comments can be used for a single element of a service; newlines are automatically replaced with spaces.

Summaries are supported by services, methods, DTOs, fields, enumerated types, enumerated values, error sets, and error values.

```fsd
  /// My awesome data.
  data MyData
  {
    …
  }
```

### Remarks

Some elements also support **remarks**: service, methods, DTOs, enumerated types, and error sets.

The remarks can use [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/). They can be arbitrarily long and can include multiple paragraphs.

#### Remarks FSD

Add remarks to an FSD file after the end of the closing brace of the `service`.

The first non-blank line immediately following the closing bracket must be a top-level `#` heading  (e.g. `# myMethod`).

That first heading as well as any additional top-level headings must match the name of the service or a method, DTO, enumerated type, or error set. Any text under that heading represents additional documentation for that part of the service.

```fsd
/// The service summary.
service MyApi
{
  /// The method summary.
  method myMethod { … }: { … }

  /// The DTO summary.
  data MyData { … }
}

# MyApi

These are the remarks for the entire service.

# myMethod

Here are the remarks for one of the service methods.

# MyData

Here are the remarks for one of the service DTOs.
```

## fsdgenfsd

`fsdgenfsd` is a rarely-used command-line tool that generates "canonical" FSD for a Facility Service Definition.

Install `fsdgenfsd` [as documented](/generate/tools#installation) from its [NuGet package](https://www.nuget.org/packages/fsdgenfsd/).

`fsdgenfsd` generates an FSD file and supports the [standard command-line options](/generate/tools#options).

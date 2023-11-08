# Facility Service Definition

A Facility Service Definition (FSD) describes the operations supported by a Facility API.

Unlike other API definition formats, an FSD focuses on the shape of the client library rather than on the HTTP paths. Each service operation has a name, request fields, and response fields. In that way it resembles [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) more than [REST](https://en.wikipedia.org/wiki/Representational_state_transfer), though it can certainly be used to describe RESTful APIs.

You can also use [OpenAPI 2.0 (aka Swagger)](https://swagger.io/) by using a tool to [convert an API in that format](/define/swagger) to/from an FSD.

## FSD File

A Facility Service Definition is represented by an FSD file.

An FSD file uses a domain-specific language in an effort to make Facility Service Definitions easier to read and write, especially for developers comfortable with C-style languages.

Each FSD file contains the definition of one **service**. The name of an FSD file is typically the service name with an `.fsd` file extension, e.g. `MyApi.fsd`.

An FSD file is a text file encoded with UTF-8 and no byte order mark (BOM).

## Service

Every service has a **name**. Unless otherwise noted, a name in this specification must start with an ASCII letter but may otherwise contain ASCII letters, numbers, and/or underscores.

A service contains one or more service elements: [methods](#methods), [data transfer objects](#data-transfer-objects), [enumerated types](#enumerated-types), and [error sets](#error-sets). A service can also have [attributes](#attributes), a [summary](#summary), and [remarks](#remarks).

#### FSD

In an FSD file, the `service` keyword starts the definition of a service. It is followed by the service name and optionally preceded by service attributes.

The methods and other service items follow the service name, enclosed in braces.

```
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

#### HTTP

The `url` parameter of the `http` attribute indicates the base URL where the HTTP service lives. The trailing slash is optional. If the attribute or its parameter is omitted, the client will have to provide the base URL.

#### Info

If desired, use the `version` parameter of the `info` attribute to indicate the version of the API.

## Attributes

Attributes are used to attach additional information to a service and its elements.

Each attribute has an alphanumeric **name** and may optionally include one or more **parameters**. Each parameter has its own **name** as well as a **value**.

The `obsolete` attribute indicates that the service element is obsolete and/or deprecated and should no longer be used. The optional `message` parameter can be used to provide additional information, e.g. what should be used instead.

#### FSD

In an FSD file, the attribute name is surrounded by square brackets. The comma-delimited parameters, if any, are surrounded by parentheses and follow the attribute name.

Each parameter value can be represented as an ASCII token or a [JSON-style](https://www.json.org/) double-quoted string. An ASCII token can consist of numbers, letters, periods, hyphens, plus signs, and/or underscores. An ASCII token is not semantically different than a double-quoted string containing that token.

```
[obsolete] // no parameters
[csharp(name: query)] // one parameter
[http(path: "/search", code: 202)] // two parameters
```

Multiple attributes can be comma-delimited within one set of square brackets (as below) and/or specified in separate sets of square brackets (as above).

```
[obsolete, csharp(name: query)]
```

#### HTTP

Every Facility API has a default HTTP mapping. The HTTP mapping can be customized by using the `http` attribute, which can be applied to services, methods, request fields, response fields, and errors.

The `http` attribute is always optional. When the attribute is omitted, the defaults are used, as documented.

## Methods

Each method represents an operation of the service.

A method has a **name**, **request fields**, and **response fields**. A method can also have [attributes](#attributes), a [summary](#summary), and [remarks](#remarks).

When a client invokes a service method, it provides values for some or all of the request fields. For example, a translation service could have a `translate` method with request fields named `text`, `sourceLanguage`, and `targetLanguage`.

If the method succeeds, values are returned for some or all of the response fields. A `translate` method might return the translated text in a `text` field and a confidence level in a `confidence` field.

If the method fails, a [service error](#service-errors) is returned instead.

#### FSD

In an FSD file, the `method` keyword starts the definition of a method. It is followed by the method name and optionally preceded by method attributes.

The request and response follow the method name, each enclosed in braces and separated by a colon (`:`). The request and response fields, if any, are listed within the braces.

```
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

#### HTTP

The `http` attribute of a method supports a parameter named `method` that indicates the HTTP method that is used, e.g. `GET`, `POST`, `PUT`, `DELETE`, or `PATCH`. If omitted, the default is `POST`. Lowercase is permitted, e.g. `[http(method: get)]`.

The `path`  parameter indicates the HTTP path of the method (relative to the base URL). The path must start with a slash. A single slash indicates that the method is at the base URL itself.

For example, if a method uses `[http(method: GET, path: "/widgets"]` in a service that uses `[http(url: "https://api.example.com/v1/"]`, the full HTTP method and path for that method would be `GET https://api.example.com/v1/widgets`.

If the `path` parameter is not specified, it defaults to the method name, e.g. `/getWidgets` for a method named `getWidgets`. This default would not be appropriate for a RESTful API, but may be acceptable for an RPC-style API.

The `code` parameter indicates the HTTP status code used if the method is successful (but see also [body fields](#body-fields) below). If omitted, it defaults to `200` (OK). If `code` is set to `204` (No Content) or `304` (Not Modified), no content is returned and [normal fields](#normal-fields) are prohibited.

```
  [http(method: POST, path: "/jobs/start", code: 202)]
  method startJob
  {
    …
  }:
  {
    …
  }
```

## Fields

A field stores data for a method request, method response, or data transfer object.

Each field has a **name** and a **type**. The field type restricts the type of data that can be stored in that field.

Fields are generally optional, i.e. they may or may not store a value.

The following primitive field types are supported:

* `string`: A string of zero or more Unicode characters.
* `boolean`: A Boolean value, i.e. true or false.
* `double`: A double-precision floating-point number.
* `int32`: A 32-bit signed integer.
* `int64`: A 64-bit signed integer.
* `decimal`: A 128-bit number appropriate for monetary calculations.
* `bytes`: Zero or more bytes.
* `object`: An arbitrary JSON object.
* `error`: A [service error](#service-errors).

A field type can be any [data transfer object](#data-transfer-objects) or [enumerated type](#enumerated-types) in the service, referenced by name.

A field type can be a [service result](#service-results). Use `result<T>` to indicate a service result; for example, `result<Widget>` is a service result whose value is a DTO named `Widget`.

A field type can be an array, i.e. zero or more ordered items of a particular type, including primitive types, data transfer objects, enumerated types, or service results. Use `T[]` to indicate an array; for example, `int32[]` is an array of `int32`.

A field type can be a dictionary that maps strings to values of a particular type, including primitive types, data transfer objects, enumerated types, or service results. Use `map<T>` to indicate a map; for example, `map<int32>` is a map of strings to `int32`.

#### FSD

In an FSD file, a field is represented by a name and a field type, which are separated by a colon (`:`) and followed by a semicolon (`;`). Fields can also be preceded by field attributes.

For fields whose type corresponds to a DTO or enumerated type, that DTO or enumerated type must be defined elsewhere in this service, before or after the method or DTO that contains the field.

#### JSON

Since [JSON](https://www.json.org/) is currently the most commonly-used serialization format for APIs over HTTP, Facility APIs are designed to be trivially compatible with JSON.

In a JSON request body, response body, or DTO, a field is serialized as a JSON object property. In fact, to avoid complicating implementations, there is no way to customize the JSON serialization of a request body, response body, or DTO. Each field is always serialized as a JSON property with the same name.

* `string`, `boolean`, `double`, `int32`, `int64`, and `decimal` are encoded as JSON literals.
* `bytes` are encoded as a [Base64](https://en.wikipedia.org/wiki/Base64) string.
* `object` is encoded as a JSON object.
* `error` is encoded as a JSON object with `code`, `message`, `details`, and `innerError` properties.
* `result<T>` is encoded as a JSON object with a `value` or `error` property.
* `T[]` is encoded as a JSON array.
* `map<T>` is encoded as a JSON object.

`null` is not a valid value for any field type. If a JSON property is set to `null`, it is treated as though it were omitted. Arrays and maps are not permitted to have `null` items.

Even though `int64` is a 64-bit signed integer, avoid ±2<sup>51</sup> or larger, as JavaScript [cannot safely represent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) integers that large. Similarly, JavaScript numbers cannot accurately represent `decimal`.

When reading JSON, conforming clients and servers may match property names case-insensitively, and they may perform type conversions for property values, e.g. strings to numbers. They may also support non-standard JSON features, such as unquoted property names, single-quoted strings, comments, etc.

However, when writing JSON, conforming clients and servers must always use [standard JSON](https://www.json.org/) with no comments, correctly-cased property names, correctly-typed property values, etc.

#### Validation

Validation requirements can be specified with `[
]`. This attribute results in invalid requests if decorated fields do not meet the specified requirements.

Types support appropriate parameters:

* string: at least a 'length' or 'regex' parameter is required.
* numeric types: a 'value' parameter is required.
* collection types: a 'count' parameter is required.
* enumerated types: support no parameters, specifying that values must be defined by the API

Range syntax is supported for numeric ranges with '..'. Both boundaries are inclusive.

```
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
  [validate(regex: "^[0-9].*$")] // must match the regular expression
  streetAddress: string;

  [validate(length: 2)] // exactly 2
  countryCode: string;
}

data PhoneNumber
{
  [validate] // only 'mobile', 'work', and 'home' are valid
  line: Line,

  [validate(regex: "^\\+[1-9]*$", length: 3..16)] // only E.164 numbers are allowed, slashes must be escaped
  number: string;
}

enum Line
{
  mobile,
  work,
  home
}
```

#### Required

Fields may be required via the `[required]` attribute. This attribute results in invalid requests if decorated fields are unspecified in request parameters.

```
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

#### HTTP

On a request or response field, the `from` parameter of the `http` attribute indicates where the field comes from. It can be set to `path`, `query`, `body`, `header`, or `normal`. Like all `http` parameters, the `from` parameter is optional; see below for defaults.

The `http` attribute should not be used on a DTO field.

#### Path Fields

If `from: path` is used on a request field, the field comes from the HTTP path of the method, which must contain the field name in braces. (Response fields cannot be path fields.)

If the name of a request field without a `from` parameter is found in the path, it is assumed to be a path field, so `from: path` never needs to be used explicitly.

For example, a `getWidget` method might have a `/widgets/{id}` path and a corresponding `id` request field.

```
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

```
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

```
  [http(path: "/widgets")]
  method createWidget
  {
    [http(from: body)]
    widget: Widget;
  }:
  {
    [http(from: body, code: 201)]
    widget: Widget;
  }
```

#### Header Fields

If `from: header` is used on a request or response field, the field is transmitted via HTTP header.

The `name` parameter of the `http` attribute can be used to indicate the name of the HTTP header; if omitted, it defaults to the field name.

Header fields must be of type `string`. The header value is not transformed in any way and must conform to the HTTP requirements for that header.

Headers commonly used by all service methods (`Authorization`, `User Agent`, etc.) are generally outside the scope of the FSD and not explicitly mentioned in each method request and/or response.

```
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

```
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

## Data Transfer Objects

Data transfer objects (DTOs) are used to combine simpler data types into a more complex data type.

Each data transfer object has a **name** and a collection of **fields**. A DTO can also have [attributes](#attributes), a [summary](#summary), and [remarks](#remarks).

#### FSD

The `data` keyword starts the definition of a DTO. It is followed by the name of the DTO and optionally preceded by data attributes. The DTO fields follow the DTO name and are enclosed in braces.

```
  data Widget
  {
    id: string;
    name: string;
  }
```

## Enumerated Types

An enumerated type is a type of string that is restricted to a set of named values.

An enumerated type has a **name** and a collection of **values**, each of which has its own **name**. An enumerated type can also have [attributes](#attributes), a [summary](#summary), and [remarks](#remarks).

The string stored by an enumerated type field should match the name of one of the values.

The value names of an enumerated type must be case-insensitively unique and may be matched case-insensitively but should nevertheless always be transmitted with the correct case.

#### FSD

The `enum` keyword starts the definition of an enumerated type. It is optionally preceded by attributes.

The enumerated values are comma-delimited alphanumeric names surrounded by braces. A final trailing comma is permitted.

```
  enum MyEnum
  {
    first,
    second,
  }
```

#### JSON

Enumerated values are always transmitted as strings, not integers.

## External Types

External types enable the use of DTOs and enumerations defined in another service. This allows a data type to be defined once and then shared across multiple services.

External types do not require access to the definition of the target type. Code generators simply assume the data type will exist when the generated code is compiled or executed. It is the responsibility of the host project implementing the service to ensure any required references are resolved (for example, a C# project may add a reference to a NuGet package or another C# project containing the target data types).

#### FSD

The `extern` keyword starts the definition of an external type. It is followed by either `data` or `enum`, depending on the external type being referenced. This is followed by the name of the external type.

Attributes on the external type instruct code generators how to reference the data type in generated code.

```
[csharp(namespace: Some.Project.Api.v1.Client)]
[js(module: "@example/some-project-api")]
extern data ExternalWidget;
```

## Service Errors

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

## Service Results

 A service result can be used in response fields by methods that perform multiple operations and want to return separate success or failure for each one.

 An instance of a service result contains exactly one of the following:

 * **value**: a value of a [particular type](#fields) (success)
 * **error**: a [service error](#service-errors) (failure)

## Error Sets

A service that needs to support non-standard error codes can define its own error set, which supplements the standard error codes.

Each error set has a **name** and a collection of **values**, each of which has its own **name**. An error set can also have [attributes](#attributes), a [summary](#summary), and [remarks](#remarks).

The name of each error set value represents a supported [error code](#service-errors).

The documentation summary of each error set value is used as the default error message for that error code.

#### FSD

The `errors` keyword starts an error set. It is followed by the name of the error set and optionally preceded by attributes.

The error values are comma-delimited alphanumeric names surrounded by braces. A final trailing comma is permitted.

#### HTTP

On an error of an error set, the `code` parameter of the `http` attribute is used to specify the HTTP status code that should be used when that error is returned, e.g. `404`.

If the `code` parameter is missing from an error, `500` (Internal Server Error) is used.

```
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

## Comments

Use two slashes to start a comment. The slashes and everything that follows them on that line are ignored (except for [summaries](#summary)).

```
  data MyData // this comment is ignored
  {
    name: string; // so is this
    // and this
  }
```

## Summary

Most elements of a service support a **summary** string for documentation purposes: service, methods, DTOs, fields, enumerated types, enumerated type values, error sets, and error set values.

The summary should be short and consist of a single sentence or short paragraph.

#### FSD

To add a summary to a service element, place a comment line before it that uses three slashes instead of two. Multiple summary comments can be used for a single element of a service; newlines are automatically replaced with spaces.

Summaries are supported by services, methods, DTOs, fields, enumerated types, enumerated values, error sets, and error values.

```
  /// My awesome data.
  data MyData
  {
    …
  }
```

## Remarks

Some elements also support **remarks**: service, methods, DTOs, enumerated types, and error sets.

The remarks can use [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/). They can be arbitrarily long and can include multiple paragraphs.

#### FSD

Add remarks to an FSD file after the end of the closing brace of the `service`.

The first non-blank line immediately following the closing bracket must be a top-level `#` heading  (e.g. `# myMethod`).

That first heading as well as any additional top-level headings must match the name of the service or a method, DTO, enumerated type, or error set. Any text under that heading represents additional documentation for that part of the service.

```
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

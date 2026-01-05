function POST(request: Request) {
  return new Response("Hello, world!");
}


function RegisterSchema(SchemaRequest: Request): Promise<void> {
    const header: Headers = new Headers()

    const request: RequestInfo = new Request('/Schema',
        {
            method: 'POST',
            headers: header,
            body: JSON.stringify(SchemaRequest)
        })

    return fetch(request)
        .then(res => {
            console.log("Request Successfull", res)
        })
}

export { RegisterSchema }
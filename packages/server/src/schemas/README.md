# Warning

The files in this folder are provided for the sake of example. Developers can experiment with custom schemas on their local machines. Schemas used in production code must be checked-in to our schemas repo and made available to clients in modules. Otherwise, the server will drop or ignore data for schemas that it doesn't know about.

## To use:

> <br>These instructions are subject to change.<br><br>

1.  Modify the `example.proto` file as needed.
2.  Regenerate `example.json` as follows:

```bash
# Assuming you're in the folder of this README file:

$ pwd=$PWD
$ pushd ../../node_modules/protobufjs/bin
$ pbjs -t json -o "$pwd/example.json" "$pwd/example.proto"
$ popd
```

3.  Copy the contents of `example.json` and paste it as the value of `pbjsSchema` field in `example.js`.
4.  If you changed the `namespace` or the `name` of the message in your proto file, update the corresponding fields in `exampleSchema.js`.
5.  Copy `example.js` to `example.mjs`. This is used by the server side.
6.  For the client, import `exampleSchema` where used.

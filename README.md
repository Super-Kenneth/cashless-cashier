# ESCPOS in Node.js Error Handling

## Error: Cannot find module 'escpos-usb'

If you encounter this error

```bash
Error: Cannot find module 'escpos-usb'
```

you can reinstall the `escpos-usb`

Uninstall

```bash
npm uninstall escpos escpos-usb usb
```

Install again

```bash
npm install escpos escpos-usb usb
```

try to run

```bash
node {your escpos file}.js
```

## Error 2

If you encounter this type of error

```bash
 usb.on('detach', function(device){
      ^

TypeError: usb.on is not a function
```

Install this

```bash
npm install -S usb@1.8.0
```

try to run

```bash
node {your escpos file}.js
```

## Check the list

```bash
npm list escpos escpos-usb usb
```

it should look like this

```bash
├─┬ escpos-usb@3.0.0-alpha.4
│ └── usb@1.8.0 deduped
├── escpos@3.0.0-alpha.6
└── usb@1.8.0
```

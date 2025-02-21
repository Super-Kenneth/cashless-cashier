const escpos = require("escpos");
escpos.USB = require("escpos-usb");

const device = new escpos.USB();
const printer = new escpos.Printer(device);
const datetime = new Date();

device.open(() => {
  printer
    .align("ct")
    .text("--------------------------------")

    .text("KENNETH STORE AND MERCHANDISE")
    .text("")
    .text("College of Mary Immaculate")
    .text(" J.P Rizal St, Brgy. Poblacion")
    .text("Pandi, 3014 Bulacan")
    .text("--------------------------------")
    .text("--------- TRANSACTIONS ---------")
    .text("--------------------------------")
    // .text("Wilkins 150ML              10.00")
    // .text("Choco Mucho Violet         10.00")
    // .text("Kanin with Rice            15.00")
    // .text("Adobong Oink               15.00")
    // .text("Coke 500ML                 20.00")
    // .text("Piattos Sour Cream         12.00")
    // .text("Garlic Butter Chicken      25.00")
    // .text("Beef Tapa                  30.00")
    // .text("Nova BBQ Flavor            10.00")
    // .text("Red Horse 500ML            10.00")
    // .text("Red Horse 500ML            10.00")
    // .text("Egg Fried Rice             15.00")
    // .text("Chicken Adobo              15.00")
    // .text("--------------------------------")
    .text("Total:                     15.00")
    .text("--------------------------------")
    .text("                                ")
    .align("LT")
    .text(`D/T: ${datetime.toLocaleString()}`)
    .text("REF #: KS250321455PSPSAA22")
    .text("STORE #: 001")
    .text("TRANS")
    .text("")
    .align("ct")
    .text("THE POS SYSTEM DEVELOPED BY")
    .text("")
    .text("Joedel Lagong")
    .text("Kenneth Manuel")
    .text("Paula Marie Mendoza")
    .text("Jorge Rayne David")
    .text("")
    // .qrimage("https://github.com/joedellagongg", function (err) {
    //   this.cut();
    //   this.close();
    // })
    // .barcode("259293295966", "EAN13", { width: 2, height: 100 })
    .cut()
    .close();
});

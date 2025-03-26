const escpos = require("escpos");
escpos.USB = require("escpos-usb");

async function printReceipt(data) {
  const { amount, full_name, store_name, store_no, ref_no } = data;

  try {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);
    const datetime = new Date();

    device.open((err) => {
      if (err) {
        console.error("Printer Connection Error:", err);
        return;
      }

      printer
        .align("ct")
        .text("--------------------------------")
        .text(`${store_name}`)
        .text("")
        .text("College of Mary Immaculate")
        .text(" J.P Rizal St, Brgy. Poblacion")
        .text("Pandi, 3014 Bulacan")
        .text("--------------------------------")
        .text("--------- TRANSACTIONS ---------")
        .text("--------------------------------")
        .text(`Total:      ${amount.toFixed(2)}`)
        .text("--------------------------------")
        .text("")
        .align("LT")
        .text(`D/T: ${datetime.toLocaleString()}`)
        .text(`REF #: ${ref_no}`)
        .text(`STAFF #: ${full_name}`)
        .text("")
        .align("ct")
        .text("THE POS SYSTEM DEVELOPED BY")
        .text("")
        .text("Joedel + Kenneth + Paula + Jorge")
        .cut()
        .close();
    });

    return {
      statusCode: 200,
      success: true,
      data: "Receipt printed successfully",
    };
  } catch (error) {
    console.error("Printing Error:", error);
    return {
      statusCode: 500,
      success: false,
      message: "ERROR: Check the Printer if it is conencted.",
    };
  }
}

async function testPrint(data) {
  const { message } = data;

  try {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);
    const datetime = new Date();

    device.open((err) => {
      if (err) {
        console.error("Printer Connection Error:", err);
        return;
      }

      printer
        .align("ct")
        // .text("--------------------------------")
        // .text("TOKEN OF APPRECIATION <3")
        // .text("THANK YOU PO! <3")
        // .text("")
        // .text("Joedel + Kenneth + Paula + Jorge")
        // .text("--------------------------------")
        .text("--------------------------------")
        .text("THE POS SYSTEM DEVELOPED BY")
        .text("")
        .text("Joedel + Kenneth + Paula + Jorge")
        .text("--------------------------------")
        .cut()
        .close();
    });

    return {
      statusCode: 200,
      success: true,
      data: "[ TEST ] Receipt printed successfully",
    };
  } catch (error) {
    console.error("Printing Error:", error);
    return {
      statusCode: 500,
      success: false,
      message: "ERROR: Check the Printer if it is connected.",
    };
  }
}

module.exports = { printReceipt, testPrint };

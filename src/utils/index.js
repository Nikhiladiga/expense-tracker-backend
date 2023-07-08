export function parseMessage(message, createdAt, id) {
    // Regular expressions to match required information

    let transaction = {};

    //Set id and created at
    transaction.id = id;
    transaction.createdAt = Number(createdAt);

    const datePattern = /\d{2}-\d{2}-\d{4}/;
    const transactionTypePattern = /(debited|credited) (from|to)/;
    const payeeName = message.split("Info-").pop().split("For")[0].split("/")[3];

    const dateMatch = message.match(datePattern);
    const transactionTypeMatch = message.match(transactionTypePattern);

    //Set date
    if (dateMatch) {
        transaction.date = convertDateFormat(dateMatch[0]);
    } else {
        return null;
    }

    //Set transaction type 
    if (transactionTypeMatch) {
        transaction.transactionType = transactionTypeMatch[1].toUpperCase() === "DEBITED" ? "DEBIT" : "CREDIT"
    } else {
        return null;
    }

    //Set payee name
    transaction.payee = payeeName

    //Set isDeleted to 0 by default
    transaction.isDeleted = 0

    //Set amount
    if (transaction.transactionType === "DEBIT") {
        transaction.amount = parseFloat(message.split("INR").pop().split("has")[0]);
    } else {
        let amount = (message.split("INR").pop().split("has")[0].split("INR").pop().split("has")[0]);
        transaction.amount = parseFloat(amount);
    }

    //Set payment method (default UPI)
    transaction.paymentMethod = "UPI";

    //Set bank (default Axis)
    transaction.bank = "Axis Bank";

    return transaction;
}

export function getStartAndEndDate(monthStartDay, month, year) {
    const dateObj = {
        startDate: null,
        endDate: null
    };

    // Step 1: Calculate the start and end dates for the dashboard
    const currentMonth = month - 1; // Month in JavaScript's Date object is zero-based (0 - 11)
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1; // Handling December edge case

    // Calculate the start date
    const startDay = monthStartDay <= getDaysInMonth(currentMonth, year) ? monthStartDay : monthStartDay - 1;
    const startDate = new Date(year, currentMonth, startDay).getTime(); // Convert to Unix timestamp

    // Calculate the end date
    let endYear = year;

    if (nextMonth === 0) {
        endYear++;
    }

    const endDay = monthStartDay <= getDaysInMonth(currentMonth, year) ? monthStartDay : monthStartDay - 1;
    const endDate = new Date(endYear, nextMonth, endDay).getTime(); // Convert to Unix timestamp

    // Format the start and end dates as strings (e.g., '5-12-2023')
    const formattedStartDate = `${startDay}-${month}-${year}`;
    const formattedEndDate = `${endDay}-${nextMonth + 1}-${endYear}`;

    // console.log("-------------------------------");
    // console.log("Start date - ", formattedStartDate);
    // console.log("End date - ", formattedEndDate);
    // console.log("-------------------------------");

    dateObj.startDate = startDate;
    dateObj.endDate = endDate;
    return dateObj;
}


const getDaysInMonth = (month, year) => {
    if (month === 1) { // February
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            return 29; // Leap year
        } else {
            return 28; // Non-leap year
        }
    } else {
        return new Date(year, month + 1, 0).getDate();
    }
};

const convertDateFormat = (dateString) => {
    const parts = dateString.split('-');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    const convertedDate = `${year}-${month}-${day}`;
    return convertedDate;
  }
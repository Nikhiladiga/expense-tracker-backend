export function parseMessage(message,createdAt,id) {
    // Regular expressions to match required information

    let transaction = {};

    //Set id and created at
    transaction.id = id;
    transaction.createdAt = createdAt;

    const datePattern = /\d{2}-\d{2}-\d{4}/;
    const transactionTypePattern = /(debited|credited) (from|to)/;
    const payeeName = message.split("Info-").pop().split("For")[0].split("/")[3];

    const dateMatch = message.match(datePattern);
    const transactionTypeMatch = message.match(transactionTypePattern);

    //Set date
    if(dateMatch){
        transaction.date = dateMatch[0];
    } else {
        return null;
    }

    //Set transaction type 
    if(transactionTypeMatch) {
        transaction.transactionType = transactionTypeMatch[1].toUpperCase() === "DEBITED" ? "DEBIT" : "CREDIT"
    } else {
        return null;
    }

    //Set payee name
    transaction.payee = payeeName
    
    //Set isDeleted to 0 by default
    transaction.isDeleted = 0

    //Set amount
    if(transaction.transactionType === "DEBIT") {
        transaction.amount = parseFloat(message.split("INR").pop().split("has")[0]);
    } else {
        let amount = (message.split("INR").pop().split("has")[0].split("INR").pop().split("has")[0]);
        transaction.amount = parseFloat(amount);
    }

    return transaction;
}

export function convertDateToTimestamp() {

}


export function convertTimestampToDate(){
    
}
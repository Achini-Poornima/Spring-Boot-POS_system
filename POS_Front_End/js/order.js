let cart = [];

$(document).ready(function() {
    loadCustomerIds();
    loadItemIds();
    $('#orderDate').val(new Date().toISOString().split('T')[0]); // Set current date
});

// --- Data Loading ---
function loadCustomerIds() {
    $.get("http://localhost:8080/api/v1/customer", (res) => {
        res.data.forEach(c => $('#cmbCustomerId').append(new Option(c.cId, c.cId)));
    });
}

function loadItemIds() {
    $.get("http://localhost:8080/api/v1/item", (res) => {
        res.data.forEach(i => $('#cmbItemId').append(new Option(i.itemId, i.itemId)));
    });
}

// --- Auto-fill Fields ---
$('#cmbCustomerId').change(function() {
    const id = $(this).val();
    $.get(`http://localhost:8080/api/v1/customer`, (res) => {
        const customer = res.data.find(c => c.cId === id);
        if(customer) $('#orderCustName').val(customer.cName);
    });
});

$('#cmbItemId').change(function() {
    const id = $(this).val();
    $.get(`http://localhost:8080/api/v1/item`, (res) => {
        const item = res.data.find(i => i.itemId === id);
        if(item) {
            $('#orderItemName').val(item.itemName);
            $('#orderItemPrice').val(item.unitPrice);
            $('#orderQtyLeft').val(item.qty);
        }
    });
});

// --- Cart Logic ---
function addToCart() {
    const item = {
        itemId: $('#cmbItemId').val(),
        itemName: $('#orderItemName').val(),
        unitPrice: parseFloat($('#orderItemPrice').val()),
        qty: parseInt($('#buyQty').val()),
        total: parseFloat($('#orderItemPrice').val()) * parseInt($('#buyQty').val())
    };

    // Simple stock validation on frontend
    if (item.qty > parseInt($('#orderQtyLeft').val())) return alert("Not enough stock!");

    cart.push(item);
    renderCart();
}

function renderCart() {
    let netTotal = 0;
    $('#cartTable tbody').empty();
    cart.forEach(i => {
        netTotal += i.total;
        $('#cartTable tbody').append(`<tr><td>${i.itemId}</td><td>${i.itemName}</td><td>${i.unitPrice}</td><td>${i.qty}</td><td>${i.total}</td></tr>`);
    });
    $('#lblTotal').text(netTotal.toFixed(2));
}

// --- Final Submission ---
function submitOrder() {
    const orderObj = {
        oid: $('#orderId').val(),
        date: $('#orderDate').val(),
        customerID: $('#cmbCustomerId').val(),
        orderDetails: cart // The array of cart items
    };

    $.ajax({
        url: "http://localhost:8080/api/v1/order",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(orderObj),
        success: function(res) {
            alert(res.message);
            location.reload(); // Refresh to clear order
        },
        error: function(err) {
            alert("Order Failed: " + err.responseJSON.message);
        }
    });
}
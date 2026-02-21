const BASE_URL = "http://localhost:8081/api/v1";
let cart = [];
let allItems = [];

$(document).ready(function() {
    loadCustomerIds();
    loadItems();
    $('#orderDate').val(new Date().toISOString().split('T')[0]);
});

function loadCustomerIds() {
    $.get(`${BASE_URL}/customer`, (res) => {
        console.log("Customer Response:", res);
        $('#cmbCustomerId').html('<option value="">Select Customer</option>');

        const data = res.data || res;

        if (data && Array.isArray(data)) {
            data.forEach(c => {
                const id = c.cId || c.cid || c.id;
                if(id) $('#cmbCustomerId').append(new Option(id, id));
            });
        }
    });
}

function loadItems() {
    $.get(`${BASE_URL}/item`, (res) => {
        console.log("Item Response:", res);
        const data = res.data || res;

        if (data && Array.isArray(data)) {
            allItems = data;
            $('#cmbItemId').html('<option value="">Select Item</option>');
            allItems.forEach(i => {
                const id = i.itemId || i.itemid || i.code;
                if(id) $('#cmbItemId').append(new Option(id, id));
            });
        }
    });
}

function addToCart() {
    const selectedId = $('#cmbItemId').val();
    const buyQty = parseInt($('#buyQty').val());

    const item = allItems.find(i => (i.itemId || i.itemid) === selectedId);

    if (!item || isNaN(buyQty) || buyQty <= 0) {
        return alert("Select an item and enter a valid quantity.");
    }

    if (buyQty > item.qty) {
        return alert("Insufficient Stock! Only " + item.qty + " available.");
    }

    let existing = cart.find(i => i.itemId === selectedId);
    if (existing) {
        if ((existing.qty + buyQty) > item.qty) return alert("Total cart quantity exceeds stock.");
        existing.qty += buyQty;
        existing.total = existing.qty * existing.unitPrice;
    } else {
        cart.push({
            itemId: selectedId,
            itemName: item.itemName || item.itemname,
            unitPrice: item.unitPrice || item.unitprice,
            qty: buyQty,
            total: (item.unitPrice || item.unitprice) * buyQty
        });
    }
    renderCart();
}

function renderCart() {
    let netTotal = 0;
    $('#cartTable tbody').empty();
    cart.forEach((i, index) => {
        netTotal += i.total;
        $('#cartTable tbody').append(`
            <tr>
                <td>${i.itemId}</td>
                <td>${i.itemName}</td>
                <td>${i.unitPrice.toFixed(2)}</td>
                <td>${i.qty}</td>
                <td>${i.total.toFixed(2)}</td>
                <td><button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${index})">Remove</button></td>
            </tr>`);
    });
    $('#lblTotal').text(netTotal.toFixed(2));
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function submitOrder() {
    const orderId = $('#orderId').val();
    const customerId = $('#cmbCustomerId').val();

    if (!orderId || !customerId || cart.length === 0) {
        return alert("Missing Order ID, Customer, or Items in Cart.");
    }

    const orderObj = {
        oid: orderId,
        date: $('#orderDate').val(),
        customerID: customerId,
        orderDetails: cart.map(i => ({
            itemId: i.itemId,
            qty: i.qty,
            unitPrice: i.unitPrice
        }))
    };

    $.ajax({
        url: `${BASE_URL}/order`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(orderObj),
        success: function(res) {
            alert(res.message);
            location.reload();
        },
        error: function(err) {
            alert("Order Failed: " + (err.responseJSON ? err.responseJSON.message : "Server Error"));
        }
    });
}
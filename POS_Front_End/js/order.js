const BASE_URL = "http://localhost:8081/api/v1"; // Standardized to 8081
let cart = [];
let allItems = [];

$(document).ready(function() {
    loadCustomerIds();
    loadItems();
    $('#orderDate').val(new Date().toISOString().split('T')[0]);
});

// --- Data Loading ---
// Update in place-order.js
function loadCustomerIds() {
    $.ajax({
        url: `${BASE_URL}/customer`,
        method: "GET",
        success: function(res) {
            console.log("Customer Data Received:", res); // Check your F12 console!
            $('#cmbCustomerId').html('<option value="">Select Customer ID</option>');
            if (res && res.data) {
                res.data.forEach(c => {
                    // Use the exact key from your CustomerDTO @JsonProperty
                    const id = c.cId;
                    $('#cmbCustomerId').append(new Option(id, id));
                });
            }
        },
        error: function(xhr) {
            console.error("Customer Load Failed. Status: " + xhr.status);
            alert("Could not load customers. Is the backend running on 8081?");
        }
    });
}

function loadItems() {
    $.ajax({
        url: `${BASE_URL}/item`,
        method: "GET",
        success: function(res) {
            console.log("Item Data Received:", res);
            if (res && res.data) {
                allItems = res.data;
                $('#cmbItemId').html('<option value="">Select Item Code</option>');
                allItems.forEach(i => {
                    const id = i.itemId;
                    $('#cmbItemId').append(new Option(id, id));
                });
            }
        }
    });
}
// --- Auto-fill Fields ---
$('#cmbCustomerId').change(function() {
    const id = $(this).val();
    if (!id) return $('#orderCustName').val("");

    $.get(`${BASE_URL}/customer`, (res) => {
        if (res.data) {
            const customer = res.data.find(c => (c.cId || c.cid) === id);
            if(customer) $('#orderCustName').val(customer.cName || customer.cname);
        }
    });
});

$('#cmbItemId').change(function() {
    const id = $(this).val();
    const item = allItems.find(i => (i.itemId || i.itemid) === id);
    if(item) {
        $('#orderItemName').val(item.itemName || item.itemname);
        $('#orderItemPrice').val(item.unitPrice || item.unitprice);
        $('#orderQtyLeft').val(item.qty);
    }
});

// --- Cart and Submit Logic remain as you have them...

// --- Cart Logic ---
function addToCart() {
    const itemId = $('#cmbItemId').val();
    const buyQty = parseInt($('#buyQty').val());
    const qtyLeft = parseInt($('#orderQtyLeft').val());

    if (!itemId || isNaN(buyQty) || buyQty <= 0) {
        return alert("Please enter a valid quantity!");
    }

    if (buyQty > qtyLeft) {
        return alert("Insufficient Stock! Available: " + qtyLeft);
    }

    // Check if item already exists in cart to update instead of add new row
    let existing = cart.find(i => i.itemId === itemId);
    if (existing) {
        if ((existing.qty + buyQty) > qtyLeft) return alert("Total cart quantity exceeds stock!");
        existing.qty += buyQty;
        existing.total = existing.qty * existing.unitPrice;
    } else {
        const item = {
            itemId: itemId,
            itemName: $('#orderItemName').val(),
            unitPrice: parseFloat($('#orderItemPrice').val()),
            qty: buyQty,
            total: parseFloat($('#orderItemPrice').val()) * buyQty
        };
        cart.push(item);
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
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">x</button></td>
            </tr>`);
    });
    $('#lblTotal').text(netTotal.toFixed(2));
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

// --- Final Submission ---
function submitOrder() {
    const orderId = $('#orderId').val();
    const customerId = $('#cmbCustomerId').val();

    if (!orderId || !customerId || cart.length === 0) {
        return alert("Please fill all details and add items to cart!");
    }

    const orderObj = {
        oid: orderId,
        date: $('#orderDate').val(),
        customerID: customerId, // Matches your OrderDTO variable name
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
            const msg = err.responseJSON ? err.responseJSON.message : "Server Error";
            alert("Order Failed: " + msg);
        }
    });
}
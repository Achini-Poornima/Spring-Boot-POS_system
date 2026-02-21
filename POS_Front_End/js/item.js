// Ensure port matches your application.properties (8081)
const BASE_URL = "http://localhost:8081/api/v1/item";

$(document).ready(function () {
    getAllItems();
});

function saveItem() {
    const itemData = {
        itemId: $("#itemId").val(),
        itemName: $("#itemName").val(),
        qty: $("#itemQty").val(),
        unitPrice: $("#unitPrice").val()
    };

    $.ajax({
        url: BASE_URL,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(itemData),
        success: function (res) {
            alert(res.message);
            getAllItems();
            clearFields();
        },
        error: function (err) {
            if (err.responseJSON && err.responseJSON.data && typeof err.responseJSON.data === 'object') {
                let errors = err.responseJSON.data;
                let msg = "Validation Error:\n";
                for (let key in errors) msg += `- ${errors[key]}\n`;
                alert(msg);
            } else {
                alert("Error: " + (err.responseJSON ? err.responseJSON.message : "Save Failed"));
            }
        }
    });
}

function updateItem() {
    const itemData = {
        itemId: $("#itemId").val(),
        itemName: $("#itemName").val(),
        qty: $("#itemQty").val(),
        unitPrice: $("#unitPrice").val()
    };

    if (!itemData.itemId) return alert("Please select an item to update.");

    $.ajax({
        url: BASE_URL,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(itemData),
        success: function (res) {
            alert(res.message);
            getAllItems();
            clearFields();
        },
        error: function (err) {
            alert("Update Failed: " + (err.responseJSON ? err.responseJSON.message : "Server Error"));
        }
    });
}

function deleteItem() {
    const id = $('#itemId').val();
    if (!id) return alert("Please enter or select an Item ID");

    if (confirm("Are you sure you want to delete item: " + id + "?")) {
        $.ajax({
            url: BASE_URL + "?id=" + id, // Standardized query param
            method: 'DELETE',
            success: function (res) {
                alert(res.message);
                getAllItems();
                clearFields();
            },
            error: function (err) {
                alert("Delete Failed: " + (err.responseJSON ? err.responseJSON.message : "Server Error"));
            }
        });
    }
}

function getAllItems() {
    $.ajax({
        url: BASE_URL,
        method: 'GET',
        success: function (res) {
            $("#itemTable tbody").empty();
            if (res.data) {
                res.data.forEach(item => {
                    // Casing defense: check for itemId and itemid
                    const id = item.itemId || item.itemid;
                    const name = item.itemName || item.itemname;
                    const qty = item.qty;
                    const price = item.unitPrice || item.unitprice;

                    const row = `<tr>
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${qty}</td>
                        <td>${parseFloat(price).toFixed(2)}</td>
                        <td>
                            <button class="btn btn-sm btn-info" 
                                onclick="loadFields('${id}', '${name}', '${qty}', '${price}')">
                                Edit
                            </button>
                        </td>
                    </tr>`;
                    $("#itemTable tbody").append(row);
                });
            }
        }
    });
}

function loadFields(id, name, qty, price) {
    $("#itemId").val(id);
    $("#itemName").val(name);
    $("#itemQty").val(qty);
    $("#unitPrice").val(price);
}

function clearFields() {
    $("#itemId, #itemName, #itemQty, #unitPrice").val("");
}
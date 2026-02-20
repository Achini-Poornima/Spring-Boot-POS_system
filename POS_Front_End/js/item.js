const BASE_URL = "http://localhost:8080/api/v1/item";

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
            alert("Error: " + (err.responseJSON ? err.responseJSON.message : "Save Failed"));
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
            alert("Update Failed!");
        }
    });
}

function deleteItem() {
    const id = $('#itemId').val();
    if (!id) return alert("Please enter or select an Item ID");

    if (confirm("Delete this item?")) {
        $.ajax({
            url: `${BASE_URL}?id=${id}`,
            method: 'DELETE',
            success: function (res) {
                alert(res.message);
                getAllItems();
                clearFields();
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
            // res.data is the list of ItemDTOs from your APIResponse
            res.data.forEach(item => {
                const row = `<tr>
                    <td>${item.itemId}</td>
                    <td>${item.itemName}</td>
                    <td>${item.qty}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-info" 
                            onclick="loadFields('${item.itemId}', '${item.itemName}', '${item.qty}', '${item.unitPrice}')">
                            Edit
                        </button>
                    </td>
                </tr>`;
                $("#itemTable tbody").append(row);
            });
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
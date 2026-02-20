const BASE_URL = "http://localhost:8080/api/v1/customer";

// Load all customers on page load
$(document).ready(function() {
    getAllCustomer();
});

function saveCustomer() {
    const data = {
        cId: $('#customerId').val(),
        cName: $('#customerName').val(),
        cAddress: $('#customerAddress').val()
    };

    $.ajax({
        url: BASE_URL,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (res) {
            alert(res.message); // "Customer Saved Successfully"
            getAllCustomer();
            clearFields();
        },
        error: function (err) {
            // Display validation error messages from the backend
            alert("Error: " + (err.responseJSON ? err.responseJSON.message : "Server Error"));
        }
    });
}

function updateCustomer() {
    const data = {
        cId: $('#customerId').val(),
        cName: $('#customerName').val(),
        cAddress: $('#customerAddress').val()
    };

    $.ajax({
        url: BASE_URL,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (res) {
            alert(res.message);
            getAllCustomer();
            clearFields();
        },
        error: function (err) {
            alert("Update Failed!");
        }
    });
}

function deleteCustomer() {
    const id = $('#customerId').val();
    if (!id) return alert("Select a customer or enter ID to delete");

    if (confirm("Are you sure?")) {
        $.ajax({
            url: `${BASE_URL}?id=${id}`,
            method: 'DELETE',
            success: function (res) {
                alert(res.message);
                getAllCustomer();
                clearFields();
            }
        });
    }
}

function getAllCustomer() {
    $.ajax({
        url: BASE_URL,
        method: 'GET',
        success: function (res) {
            $("#customerTable tbody").empty();
            // Important: We iterate over res.data because of our APIResponse wrapper
            res.data.forEach(customer => {
                const row = `<tr>
                    <td>${customer.cId}</td>
                    <td>${customer.cName}</td>
                    <td>${customer.cAddress}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="loadFields('${customer.cId}', '${customer.cName}', '${customer.cAddress}')">Edit</button>
                    </td>
                </tr>`;
                $("#customerTable tbody").append(row);
            });
        }
    });
}

function loadFields(id, name, address) {
    $('#customerId').val(id);
    $('#customerName').val(name);
    $('#customerAddress').val(address);
}

function clearFields() {
    $('#customerId, #customerName, #customerAddress').val("");
}
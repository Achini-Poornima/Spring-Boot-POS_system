const BASE_URL = "http://localhost:8081/api/v1/customer";

$(document).ready(function() {
    getAllCustomers();
});

function saveCustomer() {
    const data = {
        cId: $('#customerId').val(),
        cName: $('#customerName').val(),
        cAddress: $('#customerAddress').val()
    };

    console.log("Sending Data: ", data);

    $.ajax({
        url: "http://localhost:8081/api/v1/customer",
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (res) {
            alert(res.message);
            getAllCustomers();
            clearFields();
        },
        error: function (err) {
            if (err.responseJSON && err.responseJSON.data) {
                let errors = err.responseJSON.data;
                let errorMsg = "Validation Failed:\n";
                for (let field in errors) {
                    errorMsg += `- ${field}: ${errors[field]}\n`;
                }
                alert(errorMsg);
            } else {
                alert("Error: " + (err.responseJSON ? err.responseJSON.message : "Server Error"));
            }
        }
    });
}

function updateCustomer() {
    const data = {
        cId: $('#customerId').val(),
        cName: $('#customerName').val(),
        cAddress: $('#customerAddress').val()
    };

    if (!data.cId) return alert("Please select a customer to update.");

    $.ajax({
        url: BASE_URL,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (res) {
            alert(res.message);
            getAllCustomers();
            clearFields();
        },
        error: function (err) {
            console.error("Update Error:", err);
            alert("Update Failed: " + (err.responseJSON ? err.responseJSON.message : "Server Error"));
        }
    });
}

function deleteCustomer() {
    const id = $('#customerId').val();
    if (!id) return alert("Select a customer or enter ID to delete");

    if (confirm("Are you sure?")) {
        $.ajax({
            url: BASE_URL + "?id=" + id,
            method: 'DELETE',
            success: function (res) {
                alert(res.message);
                getAllCustomers();
                clearFields();
            },
            error: function (err) {
                console.error("Delete Error:", err);
                alert("Delete Failed: " + (err.responseJSON ? err.responseJSON.message : "Server Error"));
            }
        });
    }
}

function getAllCustomers() {
    $.ajax({
        url: BASE_URL,
        method: 'GET',
        success: function (res) {
            $("#customerTable tbody").empty();
            if(res.data) {
                console.table(res.data);

                res.data.forEach(customer => {
                    const id = customer.cId || customer.cid;
                    const name = customer.cName || customer.cname;
                    const address = customer.cAddress || customer.caddress;

                    const row = `<tr>
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${address}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="loadFields('${id}', '${name}', '${address}')">Edit</button>
                        </td>
                    </tr>`;
                    $("#customerTable tbody").append(row);
                });
            }
        },
        error: function(err) {
            console.error("Failed to fetch customers:", err);
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
const BASE_URL = "http://localhost:8081/api/v1/customer";

$(document).ready(function() {
    getAllCustomers(); // Match the function name below
});

function saveCustomer() {
    const data = {
        cId: $('#customerId').val(),
        cName: $('#customerName').val(),
        cAddress: $('#customerAddress').val()
    };

    console.log("Sending Data: ", data); // Check this in F12 Console

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
            // This will now show you EXACTLY which field failed validation
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
            // This captures the "Customer not found for update" message from your service
            alert("Update Failed: " + (err.responseJSON ? err.responseJSON.message : "Server Error"));
        }
    });
}

function deleteCustomer() {
    const id = $('#customerId').val();
    if (!id) return alert("Select a customer or enter ID to delete");

    if (confirm("Are you sure?")) {
        $.ajax({
            // Ensure the key 'id' matches the @RequestParam in Java
            url: BASE_URL + "?id=" + id,
            method: 'DELETE',
            success: function (res) {
                alert(res.message);
                getAllCustomers();
                clearFields();
            },
            error: function (err) {
                // If this triggers, check if the backend is running or if there's a CORS error
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
                // Debug: view the actual objects in the console
                console.table(res.data);

                res.data.forEach(customer => {
                    // Using bracket notation or checking both possibilities ensures we find the ID
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
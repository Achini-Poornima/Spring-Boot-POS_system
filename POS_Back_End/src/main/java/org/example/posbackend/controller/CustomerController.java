package org.example.posbackend.controller;

import jakarta.validation.Valid;
import org.example.posbackend.dto.CustomerDTO;
import org.example.posbackend.service.CustomerService;
import org.example.posbackend.util.APIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping
    public ResponseEntity<APIResponse<String>> saveCustomer(@RequestBody @Valid CustomerDTO customerDTO) {
        customerService.saveCustomer(customerDTO);
        return new ResponseEntity<>(new APIResponse<>(201, "Customer Saved Successfully", null), HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<APIResponse<String>> updateCustomer(@RequestBody @Valid CustomerDTO customerDTO) {
        customerService.updateCustomer(customerDTO);
        return new ResponseEntity<>(new APIResponse<>(200, "Customer Updated Successfully", null), HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<APIResponse<String>> deleteCustomer(@RequestParam String id) {
        customerService.deleteCustomer(id);
        return new ResponseEntity<>(new APIResponse<>(200, "Customer Deleted Successfully", null), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<CustomerDTO>>> getAllCustomers() {
        List<CustomerDTO> all = customerService.getAllCustomers();
        return new ResponseEntity<>(new APIResponse<>(200, "Success", all), HttpStatus.OK);
    }
}
package org.example.posbackend.service;

import org.example.posbackend.dto.CustomerDTO;

import java.util.List;

public interface CustomerService {
    public void saveCustomer(CustomerDTO customerDTO);
    public void updateCustomer(CustomerDTO customerDTO);
    void deleteCustomer(String id);
    List<CustomerDTO> getAllCustomers();
}

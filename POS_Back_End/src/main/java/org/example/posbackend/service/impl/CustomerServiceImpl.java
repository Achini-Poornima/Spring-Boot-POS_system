package org.example.posbackend.service.impl;

import org.example.posbackend.dto.CustomerDTO;
import org.example.posbackend.entity.Customer;
import org.example.posbackend.exception.CustomerException;
import org.example.posbackend.repository.CustomerRepository;
import org.example.posbackend.service.CustomerService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void saveCustomer(CustomerDTO customerDTO) {
        if (customerRepository.existsById(customerDTO.getcId())) {
            throw new CustomerException("Customer ID already exists");
        }
        customerRepository.save(modelMapper.map(customerDTO, Customer.class));
    }

    @Override
    public void updateCustomer(CustomerDTO customerDTO) {
        if (!customerRepository.existsById(customerDTO.getcId())) {
            throw new CustomerException("Customer not found for update");
        }
        customerRepository.save(modelMapper.map(customerDTO, Customer.class));
    }

    @Override
    public void deleteCustomer(String id) {
        if (!customerRepository.existsById(id)) {
            throw new CustomerException("Customer not found for deletion");
        }
        customerRepository.deleteById(id);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        // Correct way to map a List using ModelMapper
        return modelMapper.map(customerRepository.findAll(), new TypeToken<List<CustomerDTO>>() {}.getType());
    }
}
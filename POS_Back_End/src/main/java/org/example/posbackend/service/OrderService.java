package org.example.posbackend.service;

import org.example.posbackend.dto.OrderDTO;

public interface OrderService {
    void placeOrder(OrderDTO dto);
}
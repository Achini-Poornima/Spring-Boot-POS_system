package org.example.posbackend.service;

import org.example.posbackend.dto.OrderDTO;

public interface OrderService {
    /**
     * Handles the complete transaction of placing an order,
     * saving details, and updating item stock.
     */
    void placeOrder(OrderDTO dto);
}
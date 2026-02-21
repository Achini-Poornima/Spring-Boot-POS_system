package org.example.posbackend.controller;

import org.example.posbackend.dto.OrderDTO;
import org.example.posbackend.service.OrderService;
import org.example.posbackend.util.APIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/order")
public class OrderController {

    @Autowired
    private OrderService orderService; // Use lowerCamelCase for variable names

    @PostMapping
    public ResponseEntity<APIResponse<String>> placeOrder(@RequestBody OrderDTO orderDTO) {
        orderService.placeOrder(orderDTO);
        return new ResponseEntity<>(
                new APIResponse<>(201, "Order Placed Successfully", null),
                HttpStatus.CREATED
        );
    }
}
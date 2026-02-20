package org.example.posbackend.service.impl;

import jakarta.transaction.Transactional;
import org.example.posbackend.dto.OrderDTO;
import org.example.posbackend.dto.OrderDetailsDTO;
import org.example.posbackend.entity.Item;
import org.example.posbackend.entity.Order;
import org.example.posbackend.entity.OrderDetails;
import org.example.posbackend.exception.CustomerException;
import org.example.posbackend.repository.ItemRepository;
import org.example.posbackend.repository.OrderDetailsRepository;
import org.example.posbackend.repository.OrderRepository;
import org.example.posbackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderDetailsRepository detailsRepo;

    @Autowired
    private ItemRepository itemRepo;

    @Override
    @Transactional
    public void placeOrder(OrderDTO dto) {
        // 1. Validate Order Existence
        if (orderRepo.existsById(dto.getOid())) {
            throw new CustomerException("Order ID " + dto.getOid() + " already exists!");
        }

        // 2. Save Master Order
        Order order = new Order(dto.getOid(), dto.getDate(), dto.getCustomerID());
        orderRepo.save(order);

        // 3. Process Details
        for (OrderDetailsDTO detail : dto.getOrderDetails()) {
            Item item = itemRepo.findById(detail.getItemId())
                    .orElseThrow(() -> new CustomerException("Item not found: " + detail.getItemId()));

            // Stock Validation
            if (item.getQty() < detail.getQty()) {
                throw new CustomerException("Insufficient stock for: " + item.getItemName() +
                        " (Available: " + item.getQty() + ")");
            }

            // Save Order Detail
            OrderDetails orderDetail = new OrderDetails();
            orderDetail.setOid(dto.getOid());
            orderDetail.setItemId(detail.getItemId());
            orderDetail.setQty(detail.getQty());
            orderDetail.setUnitPrice(detail.getUnitPrice());
            detailsRepo.save(orderDetail);

            // Update Stock
            item.setQty(item.getQty() - detail.getQty());
            itemRepo.save(item);
        }
    }
}
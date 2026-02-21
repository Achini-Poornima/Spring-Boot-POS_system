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
    @Transactional // CRITICAL: Ensures all steps succeed or all fail together
    public void placeOrder(OrderDTO dto) {

        // 1. Check if Order ID already exists
        if (orderRepo.existsById(dto.getOid())) {
            throw new CustomerException("Order ID " + dto.getOid() + " already exists!");
        }

        // 2. Save the Order (Master)
        Order order = new Order(dto.getOid(), dto.getDate(), dto.getCustomerID());
        orderRepo.save(order);

        // 3. Process each Item in the Order
        for (OrderDetailsDTO detail : dto.getOrderDetails()) {

            // Fetch item and handle "Not Found"
            Item item = itemRepo.findById(detail.getItemId())
                    .orElseThrow(() -> new CustomerException("Item not found: " + detail.getItemId()));

            // Business Logic: Check Stock
            if (item.getQty() < detail.getQty()) {
                throw new CustomerException("Insufficient stock for item: " + item.getItemName() +
                        " (Available: " + item.getQty() + ")");
            }

            // 4. Save Order Detail
            OrderDetails orderDetail = new OrderDetails();
            orderDetail.setOid(dto.getOid());
            orderDetail.setItemId(detail.getItemId());
            orderDetail.setQty(detail.getQty());
            orderDetail.setUnitPrice(detail.getUnitPrice());
            detailsRepo.save(orderDetail);

            // 5. Update Item Quantity in Database
            item.setQty(item.getQty() - detail.getQty());
            itemRepo.save(item);
        }
    }
}
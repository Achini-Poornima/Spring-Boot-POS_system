package org.example.posbackend.reporsitory;

import org.example.posbackend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// Change OrderDetails to Order, and Integer to String
public interface OrderRepository extends JpaRepository<Order, String> {
}
package org.example.posbackend.repository;

import org.example.posbackend.entity.OrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// Change Integer to Long to match the @Id in your OrderDetails entity
public interface OrderDetailsRepository extends JpaRepository<OrderDetails, Long> {
}
package org.example.posbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Item {
    @Id
    private String itemId;
    private String itemName;
    private Integer qty;
    private Double unitPrice;
}
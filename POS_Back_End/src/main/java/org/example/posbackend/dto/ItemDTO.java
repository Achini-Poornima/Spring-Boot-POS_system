package org.example.posbackend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ItemDTO {
    @NotBlank(message = "Item Code is required")
    private String itemId;

    @NotBlank(message = "Item Name is required")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    private String itemName;

    @NotNull(message = "Quantity is required")
    @PositiveOrZero(message = "Quantity cannot be negative")
    private Integer qty;

    @NotNull(message = "Unit Price is required")
    @DecimalMin(value = "0.1", message = "Price must be greater than 0")
    private Double unitPrice;
}
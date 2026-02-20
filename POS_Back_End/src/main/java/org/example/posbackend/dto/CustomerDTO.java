package org.example.posbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CustomerDTO {
    @NotNull(message = "ID is required")
    private String cId;

    @NotBlank(message = "Customer Name is required")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Customer Name is Incorrect")
    private String cName;

    @Size(min = 10, max = 100, message = "Address must be between 10 and 100 characters")
    private String cAddress;

    public String getcId() {
        return cId;
    }
}
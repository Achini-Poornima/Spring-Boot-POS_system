package org.example.posbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CustomerDTO {
    @JsonProperty("cId")
    @NotBlank(message = "ID cannot be empty")
    private String cId;

    @JsonProperty("cName")
    @NotBlank(message = "Name cannot be empty")
    @Pattern(regexp = "^[a-zA-Z.\\s]+$", message = "Name must contain only letters")
    private String cName;

    @JsonProperty("cAddress")
    @NotBlank(message = "Address cannot be empty")
    @Size(min = 5, max = 100, message = "Address must be between 5 and 100 characters")
    private String cAddress;

    public String getcId() {
        return cId;
    }
}
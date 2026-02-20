package org.example.posbackend.exception;

import org.example.posbackend.util.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles your custom business logic errors (e.g., duplicate ID, out of stock)
    @ExceptionHandler(CustomerException.class)
    public ResponseEntity<APIResponse<String>> handleCustomerException(CustomerException e) {
        return new ResponseEntity<>(
                new APIResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null),
                HttpStatus.BAD_REQUEST
        );
    }

    // Handles @Valid failures in DTOs
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse<Map<String, String>>> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(err ->
                errors.put(err.getField(), err.getDefaultMessage())
        );
        return new ResponseEntity<>(
                new APIResponse<>(HttpStatus.BAD_REQUEST.value(), "Validation Failed", errors),
                HttpStatus.BAD_REQUEST
        );
    }

    // Handles Null Pointers specifically
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<APIResponse<String>> handleNullPointer(NullPointerException e) {
        return new ResponseEntity<>(
                new APIResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "A required data field was missing", e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    // Catch-all for any other server errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse<String>> handleGeneralException(Exception e) {
        return new ResponseEntity<>(
                new APIResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
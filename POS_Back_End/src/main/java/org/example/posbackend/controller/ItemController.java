package org.example.posbackend.controller;

import jakarta.validation.Valid;
import org.example.posbackend.dto.ItemDTO;
import org.example.posbackend.service.ItemService;
import org.example.posbackend.util.APIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/item")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @PostMapping
    public ResponseEntity<APIResponse<String>> saveItem(@RequestBody @Valid ItemDTO itemDTO) {
        itemService.saveItem(itemDTO);
        return new ResponseEntity<>(new APIResponse<>(201, "Item Saved Successfully", null), HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<APIResponse<String>> updateItem(@RequestBody @Valid ItemDTO itemDTO) {
        itemService.updateItem(itemDTO);
        return new ResponseEntity<>(new APIResponse<>(200, "Item Updated Successfully", null), HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<APIResponse<String>> deleteItem(@RequestParam String id) {
        itemService.deleteItem(id);
        return new ResponseEntity<>(new APIResponse<>(200, "Item Deleted Successfully", null), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<ItemDTO>>> getAllItems() {
        List<ItemDTO> all = itemService.getAllItems();
        return new ResponseEntity<>(new APIResponse<>(200, "Success", all), HttpStatus.OK);
    }
}
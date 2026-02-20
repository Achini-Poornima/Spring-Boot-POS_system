package org.example.posbackend.service;

import org.example.posbackend.dto.ItemDTO;

import java.util.List;

public interface ItemService {
    public void saveItem(ItemDTO itemDTO);
    public void updateItem(ItemDTO itemDTO);
    void deleteItem(String id);
    List<ItemDTO> getAllItems();
}

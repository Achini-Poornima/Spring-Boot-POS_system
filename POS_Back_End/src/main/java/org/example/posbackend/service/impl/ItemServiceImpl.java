package org.example.posbackend.service.impl;

import org.example.posbackend.dto.ItemDTO;
import org.example.posbackend.entity.Item;
import org.example.posbackend.exception.CustomerException;
import org.example.posbackend.repository.ItemRepository;
import org.example.posbackend.service.ItemService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void saveItem(ItemDTO itemDTO) {
        if (itemRepository.existsById(itemDTO.getItemId())) {
            throw new CustomerException("Item Code already exists: " + itemDTO.getItemId());
        }
        itemRepository.save(modelMapper.map(itemDTO, Item.class));
    }

    @Override
    public void updateItem(ItemDTO itemDTO) {
        if (!itemRepository.existsById(itemDTO.getItemId())) {
            throw new CustomerException("Item not found for update: " + itemDTO.getItemId());
        }
        itemRepository.save(modelMapper.map(itemDTO, Item.class));
    }

    @Override
    public void deleteItem(String id) {
        if (!itemRepository.existsById(id)) {
            throw new CustomerException("Item not found for deletion: " + id);
        }
        itemRepository.deleteById(id);
    }

    @Override
    public List<ItemDTO> getAllItems() {
        return modelMapper.map(itemRepository.findAll(), new TypeToken<List<ItemDTO>>() {}.getType());
    }
}
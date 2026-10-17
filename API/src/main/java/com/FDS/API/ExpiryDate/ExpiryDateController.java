package com.FDS.API.ExpiryDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/expiry")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ExpiryDateController {
    @Autowired
    private ExpiryDateRepository repository;

    @PostMapping("/add")
    public ExpiryDate addExpiry(@RequestBody ExpiryDate expiryDate) {
        return repository.save(expiryDate);
    }

    @GetMapping("/all")
    public List<ExpiryDate> getAllExpiryDates() {
        return repository.findAll();
    }

    @PutMapping("/update/{id}")
    public ExpiryDate updateExpiry(@PathVariable Long id, @RequestBody ExpiryDate updatedItem) {
        return repository.findById(id).map(item -> {
            item.setFoodItem(updatedItem.getFoodItem());
            item.setExpiryDate(updatedItem.getExpiryDate());
            return repository.save(item);
        }).orElseThrow(() -> new RuntimeException("Item not found"));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteExpiry(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @GetMapping("/search")
    public List<ExpiryDate> searchItems(@RequestParam String query) {
        return repository.findByFoodItemContainingIgnoreCase(query);
    }
} 
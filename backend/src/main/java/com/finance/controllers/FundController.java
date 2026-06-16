package com.finance.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.services.FundService;
import com.finance.dtos.FundDto;
import com.finance.models.Fund;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/funds")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class FundController {

    private final FundService fundService;
    
    public FundController(FundService fundService) {
        this.fundService = fundService;
    }

    @GetMapping
    public ResponseEntity<Iterable<Fund>> getAllFunds() {
        return fundService.getAllFunds();
    }

    @PostMapping
    public ResponseEntity<Fund> createFund(@RequestBody FundDto dto) {
        return fundService.createFund(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fund> updateFund(@PathVariable int id, @RequestBody FundDto dto) {
        return fundService.updateFund(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFund(@PathVariable int id) {
        return fundService.deleteFund(id);
    }


}

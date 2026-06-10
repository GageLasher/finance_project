package com.finance.services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.finance.dtos.FundDto;
import com.finance.models.Fund;
import com.finance.repositories.FundRepository;

@Service
public class FundService {
    private final FundRepository repo;

    public FundService(FundRepository repo) {
        this.repo = repo;
    }

public ResponseEntity<Iterable<Fund>> getAllFunds() {
        return ResponseEntity.ok(repo.findAll());
    }

public ResponseEntity<Fund> createFund(FundDto dto) {
        return ResponseEntity.status(201).body(this.repo.save(new Fund(0L, dto.name(), dto.ticker(), dto.category(), dto.expenseRatio(),
                dto.nav(), dto.manager(), dto.inceptionDate())));
    }

public ResponseEntity<Fund> updateFund(Long id, FundDto dto) {
       if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Fund updatedFund = this.repo.save(new Fund(id, dto.name(), dto.ticker(), dto.category(), dto.expenseRatio(),
                dto.nav(), dto.manager(), dto.inceptionDate()));
        return ResponseEntity.ok(updatedFund);
    }

public ResponseEntity<Void> deleteFund(Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}

package com.finance.services;

import com.finance.FinanceProjectApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.finance.dtos.FundDto;
import com.finance.models.Fund;
import com.finance.repositories.FundRepository;

@Service
public class FundService {
    private final FinanceProjectApplication financeProjectApplication;
    private final FundRepository repo;

    public FundService(FundRepository repo, FinanceProjectApplication financeProjectApplication) {
        this.repo = repo;
        this.financeProjectApplication = financeProjectApplication;
    }

public ResponseEntity<Iterable<Fund>> getAllFunds() {
        return ResponseEntity.ok(repo.findAll());
    }

public ResponseEntity<Fund> createFund(FundDto dto) {
        if(repo.findByTicker(dto.ticker()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        if(dto.expenseRatio() <= 0.0 || dto.nav() <= 0.0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.status(201).body(this.repo.save(new Fund(0, dto.name(), dto.ticker(), dto.category(), dto.expenseRatio(),
                dto.nav(), dto.manager(), dto.inceptionDate())));
    }

public ResponseEntity<Fund> updateFund(int id, FundDto dto) {
       if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
         if(repo.findByTicker(dto.ticker()).isPresent() && repo.findByTicker(dto.ticker()).get().getId() != id) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        if(dto.expenseRatio() <= 0.0 || dto.nav() <= 0.0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        Fund updatedFund = this.repo.save(new Fund(id, dto.name(), dto.ticker(), dto.category(), dto.expenseRatio(),
                dto.nav(), dto.manager(), dto.inceptionDate()));
        return ResponseEntity.status(HttpStatus.OK).body(updatedFund);
    }

public ResponseEntity<Void> deleteFund(int id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}

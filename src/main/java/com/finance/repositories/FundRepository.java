package com.finance.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.finance.models.Fund;

@Repository
public interface FundRepository extends CrudRepository<Fund, Integer> {

}

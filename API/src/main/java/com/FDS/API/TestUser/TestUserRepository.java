package com.FDS.API.TestUser;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface TestUserRepository extends CrudRepository<TestUser, Long> {
    TestUser findByEmail(String email);
    @Query("SELECT u FROM TestUser u WHERE u.accountType = com.FDS.API.TestUser.AccountType.FOOD_BANK")
    List<TestUser> findAllFoodBanks();
    List<TestUser> findByAccountType(AccountType accountType); // Find users by account type
}

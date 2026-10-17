package com.FDS.API;

import java.util.Arrays;

import com.FDS.API.Chat.Conversation;
import com.FDS.API.Chat.ConversationRepository;
import com.FDS.API.Chat.Message;
import com.FDS.API.Chat.MessageRepository;
import com.FDS.API.FoodDonation.FoodDonation;
import com.FDS.API.FoodDonation.FoodDonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import com.FDS.API.leaderboard.LeaderboardComment;
import com.FDS.API.leaderboard.LeaderboardCommentRepository;

import com.FDS.API.TestUser.AccountType;
import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;
import com.FDS.API.communityforum.ForumPost;
import com.FDS.API.communityforum.ForumPostRepository;
import com.FDS.API.communityforum.Likes;
import com.FDS.API.communityforum.LikesRepository;
import com.FDS.API.communityforum.Reply;
import com.FDS.API.communityforum.ReplyRepository;
//import com.FDS.API.leaderboard.LeaderboardComment;
import com.FDS.API.leaderboard.LeaderboardEntry;
import com.FDS.API.leaderboard.LeaderboardRepository;

import java.time.LocalDate;
import java.util.ArrayList;

// This file adds values to H2 database tables at the start).
// Since H2 is an in-memory database, everything is deleted at termination so we can add these values so table is not empty
@Component
public class DatabaseInit implements CommandLineRunner {
    @Autowired
    private TestUserRepository userRepo;

    @Autowired
    private LeaderboardCommentRepository leaderboardCommentRepository;

    @Autowired
    private ForumPostRepository forumRepo;

    @Autowired
    private ReplyRepository forumReplyRepo;

    @Autowired
    private LikesRepository likesRepo;

    @Autowired
    private FoodDonationRepository foodDonationRepository;

    @Autowired
    private ConversationRepository convoRepo;

    @Autowired
    private MessageRepository messageRepo;

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Override
    public void run(String... args) throws Exception {
        // Add test users to db
        System.out.println("\n\nAdding test users to database:");

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        TestUser John = new TestUser("John Doe", "https://storage.googleapis.com/cs2001-food-waste-proj/user-1.jpg",
                "j.doe@example.com", encoder.encode("johnPass"), AccountType.INDIVIDUAL, null);

        TestUser Greggs = new TestUser("Greggs", "https://storage.googleapis.com/cs2001-food-waste-proj/user-2.jpg",
                "greggs@example.com", encoder.encode("greggsPass"), AccountType.BUSINESS,
                "Greggs, the UK's favorite bakery chain, is all about providing freshly prepared food at great value. We proudly run the Greggs Foundation, which donates unsold food to food banks and charities. By doing this, we help support communities while reducing waste.");
        TestUser Subway = new TestUser("Subway", "https://storage.googleapis.com/cs2001-food-waste-proj/user-4.png",
                "subway@example.com", encoder.encode("subwayPass"), AccountType.BUSINESS,
                "Subway is a global leader in freshly made, customizable sandwiches and salads. In the UK, we're committed to giving back to the community by donating unsold food to local charities and food banks through initiatives like the Subway Cares Foundation. We aim to fight hunger while reducing food waste, making a positive impact one sandwich at a time.");
        TestUser Co_op = new TestUser("Co-op", "https://storage.googleapis.com/cs2001-food-waste-proj/user-5.png",
                "co-op@example.com", encoder.encode("coPass"), AccountType.BUSINESS,
                "The Co-op is a community-driven retailer passionate about making a difference. As part of our commitment to fighting food poverty, we work with Fareshare to donate unsold food and support local food banks across the UK. We believe in helping communities thrive.");

        TestUser Trussell = new TestUser("Trussell Trust",
                "https://storage.googleapis.com/cs2001-food-waste-proj/user-3.jpg", "trussell.trust@example.com",
                encoder.encode("trussellPass"), AccountType.FOOD_BANK,
                "The Trussell Trust runs a network of food banks across the UK, providing emergency food and support to people in crisis. We work with communities to fight hunger and poverty while addressing the root causes of hardship.\n\nWhat we need most:\nTinned meats, pasta sauces, long-life milk, and toiletries.");
        TestUser Felix = new TestUser("The Felix Project",
                "https://storage.googleapis.com/cs2001-food-waste-proj/user-6.png", "felixproj@example.com",
                encoder.encode("felixPass"), AccountType.FOOD_BANK,
                "The Felix Project rescues good quality surplus food and delivers it to charities and schools. Our mission is to ensure no one goes hungry while reducing food waste across London.\nIn need of: Non-perishable goods, frozen food, and beverages (non-alcoholic).");
        TestUser FareShare = new TestUser("FareShare",
                "https://storage.googleapis.com/cs2001-food-waste-proj/user-9.png", "fareshare@example.com",
                encoder.encode("farePass"), AccountType.FOOD_BANK,
                "FareShare Greater London redistributes surplus food from supermarkets and wholesalers to charities and community groups, including food banks. By tackling food waste, we aim to fight hunger and build stronger communities.\n\nLooking for: Fresh produce, bakery items, and packaged goods with long shelf lives.");
        TestUser CityHarvest = new TestUser("City Harvest",
                "https://storage.googleapis.com/cs2001-food-waste-proj/user-7.jpg", "city.harvest@example.com",
                encoder.encode("cityPass"), AccountType.FOOD_BANK,
                "City Harvest rescues surplus food from businesses and redistributes it to over 350 charities and food banks across London. We aim to combat food insecurity and ensure no good food goes to waste.\nPreferred donations: Packaged snacks, canned soups, and high-protein foods.");

        // Adding to DB individually so the generated IDs are in the correct order (for
        // Frontend testing)
        userRepo.save(John); // ID 1
        userRepo.save(Greggs); // ID 2
        userRepo.save(Trussell); // ID 3

        // Add the rest of the users
        userRepo.saveAll(Arrays.asList(Subway, Co_op, Felix, FareShare, CityHarvest));

        // Add posts to community forum
        System.out.println("\n\nAdding example posts to Community Forum:");
        ForumPost post1 = new ForumPost(
                "We're hosting a fun-filled bake-off event at Battersea Park this Saturday from 11 AM to 4 PM! Come along to enjoy delicious treats, showcase your baking skills, and support a great cause.\n\nAll proceeds from the event will go to local food banks, helping families in need. Whether you're a baking pro or just love good food, there's something for everyone!\n\n🍪 Baking competition with prizes\n☕ Coffee and snacks available\n🎶 Live music and entertainment\n\nLet's bake a difference together! Hope to see you there.",
                null, Double.valueOf(51.47912385276632), Double.valueOf(-0.1564877914947558), Greggs);
        ForumPost post2 = new ForumPost(
                "We at The Felix Project have been receiving amazing support from local businesses. In the past month alone, we've been able to distribute over 100,000 meals to schools and charities. If you're looking to help, we are especially in need of non-perishable items, frozen food, and beverages. Thank you to everyone who has contributed so far – your support makes a huge impact!",
                null, null, null, Felix);
        ForumPost post3 = new ForumPost(
                "I had some leftover bread, milk, and eggs, so I decided to make a classic French toast for breakfast, and it turned out delicious!\n\nHere's what I did:\n • Whisked together 2 eggs, 1 cup of milk, and a dash of cinnamon.\n • Soaked 4 slices of leftover bread in the mixture, making sure each side was coated well.\n • Heated a little butter in a pan and cooked the soaked bread for about 2-3 minutes on each side, until golden brown and crispy.\n • Served with a drizzle of maple syrup, fresh berries, and a dusting of powdered sugar.\n\nLet me know if you try it - perfect for a cozy breakfast!",
                "https://storage.googleapis.com/cs2001-food-waste-proj/post-e1919b8f-ac1d-4237-a736-7aa5c8d48eb1", null,
                null, John);
        ForumPost post4 = new ForumPost(
                "Join Us for a Community Food Drive!\n\nWe're organizing a food drive at selected Subway stores this month! Donate non-perishable items and enjoy a free cookie as our way of saying thank you.  All donations will go to local food banks, helping those in need.\n\nLet's work together to make a difference! 💪",
                null, null, null, Subway);
        forumRepo.saveAll(Arrays.asList(post1, post2, post3, post4));

        // Add replies to those posts
        System.out.println("\n\nAdding example replies to community forum posts:");
        Reply reply1 = new Reply(
                "This is such a great initiative! I love how businesses like Subway are making a positive impact in the community. I will definitely be donating next time I pass by a store.",
                post1, John);
        Reply reply2 = new Reply(
                "This is amazing, Subway! Food drives like these are so crucial in helping us feed those who need it most. 🙏 Keep up the great work!",
                post1, Felix);
        Reply reply3 = new Reply("100,000 meals! That's incredible! 🙌", post2, Co_op);
        Reply reply4 = new Reply("That's great to hear!", post2, Greggs);
        forumReplyRepo.saveAll(Arrays.asList(reply1, reply2, reply3, reply4));

        // Add likes to posts
        System.out.println("\n\nAdding likes to posts community forum posts:");
        Likes like1 = new Likes(Subway, post2);
        Likes like2 = new Likes(John, post2);
        Likes like3 = new Likes(Co_op, post2);
        Likes like4 = new Likes(Trussell, post2);
        Likes like5 = new Likes(John, post1);
        Likes like6 = new Likes(FareShare, post1);
        Likes like7 = new Likes(CityHarvest, post1);
        Likes like8 = new Likes(Greggs, post3);
        Likes like9 = new Likes(Felix, post3);
        Likes like10 = new Likes(CityHarvest, post4);
        likesRepo.saveAll(Arrays.asList(like1, like2, like3, like4, like5, like6, like7, like8, like9, like10));

        // Add food donations to db
        System.out.println("\n\nAdding example food donations to database:");
        FoodDonation donation1 = new FoodDonation("Freshly baked bread", 10.2, "2021-12-01","https://media.licdn.com/dms/image/v2/D4E0BAQGA_82vhKKQrw/company-logo_200_200/company-logo_200_200/0/1698853690865/fareshare_north_east_logo?e=2147483647&v=beta&t=whH0jWAULNWTjxndOiQu250MmLAHFne3rsv5iLHoddU", "accepted", Trussell, Greggs);
        FoodDonation donation2 = new FoodDonation("Mixed fruit basket", 5.5, "2021-11-30","https://www.hilbre.wirral.sch.uk/_site/data/files/images/auto_upload/7C40E4A3187A5634D746D8D3942BB261.png", "pending", Trussell, John);
        FoodDonation donation3 = new FoodDonation("Canned soup", 7.0, "2022-01-05","https://images.squarespace-cdn.com/content/v1/5c5c4471d86cc957ecc9094d/1552993279130-42YSJ14J1KXA9AS89MAZ/FREE-Foodcycle-Meals-Throughout-The-UK-Gratisfaction-UK-Freebies.jpg","accepted", Felix, Greggs);
        FoodDonation donation4 = new FoodDonation("Rice", 3.5, "2022-02-10", "https://www.hilbre.wirral.sch.uk/_site/data/files/images/auto_upload/7C40E4A3187A5634D746D8D3942BB261.png", "pending", Trussell, John);
        FoodDonation donation5 = new FoodDonation("Pasta", 2.8, "2022-02-15", "https://thefelixproject.org/uploads/branding/Felix-Signature.png", "pending", Trussell, John);
        FoodDonation donation6 = new FoodDonation("Cereal", 1.5, "2022-03-01", "https://media.licdn.com/dms/image/v2/D4E0BAQGA_82vhKKQrw/company-logo_200_200/company-logo_200_200/0/1698853690865/fareshare_north_east_logo?e=2147483647&v=beta&t=whH0jWAULNWTjxndOiQu250MmLAHFne3rsv5iLHoddU", "pending", Trussell, Co_op);

        foodDonationRepository.saveAll(Arrays.asList(donation1, donation2, donation3, donation4, donation5, donation6));

        // Chat feature
        // Create conversations for db
        System.out.println("\n\nCreating example conversations for the database:");
        Conversation convo1 = new Conversation(Greggs, Trussell);
        Conversation convo2 = new Conversation(Co_op, Greggs);
        Conversation convo3 = new Conversation(John, Felix);
        convoRepo.saveAll(Arrays.asList(convo1, convo2, convo3));

        // Add example messages to conversations
        System.out.println("\n\nAdding example messages to chat conversations:");
        Message message1 = new Message(convo1, Trussell,
                "Hello! Thank you for offering to donate. We're so grateful for your support. 😊");
        Message message2 = new Message(convo1, Greggs,
                "You're welcome! I have a bunch of canned goods, pasta, and some non-perishables. When can I drop them off?");
        Message message3 = new Message(convo1, Trussell,
                "That's awesome! We can arrange for a pickup or you can drop them off at our location. Which would you prefer?");
        Message message4 = new Message(convo1, Greggs, "A pickup would be great!");
        Message message5 = new Message(convo1, Greggs, "What time works best for you?");
        Message message6 = new Message(convo1, Trussell,
                "We can schedule a pickup for tomorrow afternoon. Does 2 PM work for you?");
        Message message7 = new Message(convo1, Greggs, "Perfect! I'll have everything ready by then.");
        Message message8 = new Message(convo1, Trussell, "Thanks so much! Our team will be there at 2 PM.");
        Message message9 = new Message(convo2, Co_op, "Hey Greggs!");
        Message message10 = new Message(convo2, Co_op, "Are you intertested in a partnership with us?");
        messageRepo.saveAll(Arrays.asList(message1, message2, message3, message4, message5, message6, message7,
                message8, message9, message10));

        // Add leaderboard entries with specific dates
        System.out.println("\n\nAdding example leaderboard entries to database:");

        // Create a variety of leaderboard entries with specific dates
        ArrayList<LeaderboardEntry> leaderboardEntries = new ArrayList<>();

        // Greggs donations
        leaderboardEntries.add(new LeaderboardEntry(Greggs, 75.0, LocalDate.of(2025, 3, 16))); // Recent donation
        leaderboardEntries.add(new LeaderboardEntry(Greggs, 50.0, LocalDate.of(2025, 3, 13))); // Last week
        leaderboardEntries.add(new LeaderboardEntry(Greggs, 40.0, LocalDate.of(2025, 3, 3))); // Earlier this month
        leaderboardEntries.add(new LeaderboardEntry(Greggs, 60.0, LocalDate.of(2025, 2, 21))); // Last month
        leaderboardEntries.add(new LeaderboardEntry(Greggs, 85.0, LocalDate.of(2025, 1, 30))); // January
        leaderboardEntries.add(new LeaderboardEntry(Greggs, 72.0, LocalDate.of(2024, 12, 12))); // December
        leaderboardEntries.add(new LeaderboardEntry(Greggs, 55.0, LocalDate.of(2024, 10, 18))); // October
        leaderboardEntries.add(new LeaderboardEntry(Greggs, 45.0, LocalDate.of(2024, 5, 23))); // May 2024

        // Subway donations
        leaderboardEntries.add(new LeaderboardEntry(Subway, 65.0, LocalDate.of(2025, 3, 15))); // Recent donation
        leaderboardEntries.add(new LeaderboardEntry(Subway, 82.5, LocalDate.of(2025, 3, 6))); // Earlier this month
        leaderboardEntries.add(new LeaderboardEntry(Subway, 90.0, LocalDate.of(2025, 2, 18))); // Last month
        leaderboardEntries.add(new LeaderboardEntry(Subway, 78.0, LocalDate.of(2025, 1, 17))); // January
        leaderboardEntries.add(new LeaderboardEntry(Subway, 110.0, LocalDate.of(2024, 11, 9))); // November
        leaderboardEntries.add(new LeaderboardEntry(Subway, 85.0, LocalDate.of(2024, 9, 20))); // September
        leaderboardEntries.add(new LeaderboardEntry(Subway, 77.0, LocalDate.of(2024, 7, 15))); // July 2024

        // Co-op donations
        leaderboardEntries.add(new LeaderboardEntry(Co_op, 98.5, LocalDate.of(2025, 3, 17))); // Yesterday
        leaderboardEntries.add(new LeaderboardEntry(Co_op, 76.8, LocalDate.of(2025, 2, 28))); // Late February
        leaderboardEntries.add(new LeaderboardEntry(Co_op, 65.0, LocalDate.of(2025, 2, 11))); // Early February
        leaderboardEntries.add(new LeaderboardEntry(Co_op, 45.0, LocalDate.of(2024, 12, 18))); // December
        leaderboardEntries.add(new LeaderboardEntry(Co_op, 71.0, LocalDate.of(2024, 8, 22))); // August 2024

        // John (individual) donations
        leaderboardEntries.add(new LeaderboardEntry(John, 28.5, LocalDate.of(2025, 3, 14))); // Recent donation
        leaderboardEntries.add(new LeaderboardEntry(John, 50.0, LocalDate.of(2025, 2, 26))); // Last month
        leaderboardEntries.add(new LeaderboardEntry(John, 35.0, LocalDate.of(2025, 1, 19))); // January
        leaderboardEntries.add(new LeaderboardEntry(John, 25.0, LocalDate.of(2024, 10, 18))); // October
        leaderboardEntries.add(new LeaderboardEntry(John, 42.0, LocalDate.of(2024, 6, 22))); // June 2024

        // Some foodbank users also making donations to other foodbanks
        leaderboardEntries.add(new LeaderboardEntry(Trussell, 120.0, LocalDate.of(2025, 3, 8))); // This month
        leaderboardEntries.add(new LeaderboardEntry(Felix, 60.0, LocalDate.of(2025, 3, 11))); // This week

        leaderboardRepository.saveAll(leaderboardEntries);

        System.out.println("\n\nAdding example leaderboard comments to database:");
        LeaderboardComment comment1 = new LeaderboardComment(John, "Great to see so many businesses contributing to such a good cause!");
        comment1.addLike(Greggs);
        comment1.addLike(Felix);

        LeaderboardComment comment2 = new LeaderboardComment(Greggs, "We're proud to be part of this community. Let's keep up the good work together and fight food waste!");
        comment2.addLike(John);
        comment2.addLike(Trussell);
        comment2.addLike(Felix);
        comment2.addLike(FareShare);

        LeaderboardComment comment3 = new LeaderboardComment(Felix, "As a food bank, we're incredibly grateful for all the donations. The impact on our community is immeasurable.");
        comment3.addLike(John);
        comment3.addLike(Greggs);
        comment3.addLike(Subway);
        comment3.addLike(Co_op);
        comment3.addLike(CityHarvest);

        leaderboardCommentRepository.saveAll(Arrays.asList(comment1, comment2, comment3));

       
    }
}
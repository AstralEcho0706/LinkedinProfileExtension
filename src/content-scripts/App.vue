<template>
  <div v-if="showCE">
    <div class="kps-content-view" ref="contentView">
      <loading v-model:active="isLoading" :is-full-page="fullPage" />
      <div
        :class="[
          align === 'left'
            ? 'modal fade save-as-modal left-modal'
            : 'modal fade save-as-modal right-modal',
        ]"
        id="staticReveal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        ref="contentModal"
        aria-labelledby="staticRevealLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticRevealLabel">Save as</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="save-as-wrapper">
                <div class="pb-4 save-list">
                  <select
                    class="mb-3 form-select form-select-lg"
                    aria-label=".form-select-lg example "
                    v-model="selectedListOption"
                  >
                    <!-- <option selected>Open this select menu</option>-->
                    <option
                      :value="item._id"
                      v-for="item in savedFolderList"
                      :key="item._id"
                    >
                      {{ item.listTitle }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer d-flex justify-content-between">
              <button
                type="button"
                data-bs-dismiss="modal"
                class="btn btn-secondary ctn"
                @click="createNewList"
              >
                Create new list
              </button>
              <button
                class="btn theme-btn-primary"
                @click="multi ? multiContactSave() : contactSave()"
                :disabled="savedFolderList.length === 0"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        :class="[
          align === 'left'
            ? 'modal fade save-as-modal left-modal'
            : 'modal fade save-as-modal right-modal',
        ]"
        id="selectCrm"
        ref="contentModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticRevealLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticRevealLabel">
                Please select CRM
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="save-as-wrapper">
                <div class="pb-4 save-list">
                  <div id="checkbox-group">
                    <button
                      class="theme-btn-primary"
                      style="margin-bottom: 10px"
                      @click="uploadCRM('salesforce')"
                    >
                      Salesforce
                    </button>
                    <button
                      class="theme-btn-primary"
                      @click="uploadCRM('hubspot')"
                    >
                      HubSpot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        :class="[
          align === 'left'
            ? 'modal fade save-as-modal left-modal'
            : 'modal fade save-as-modal right-modal',
        ]"
        id="createNewList"
        ref="contentModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticNewList"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header2 d-flex justify-content-between">
              <button data-bs-toggle="modal" @click="backToSave()">
                <img :src="chevron_left" />
              </button>
              <h5 class="text-center modal-title" id="staticNewList">
                Create new list
              </h5>

              <button
                type="button"
                class="btn-close"
                @click="modalClose()"
              ></button>
            </div>
            <div class="modal-body">
              <div class="save-as-wrapper">
                <div class="pb-4 save-list">
                  <label for="">List name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Create new list"
                    v-model="createListName"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer d-flex justify-content-between">
              <button
                type="button"
                class="btn btn-secondary ctn"
                @click="backToSave()"
              >
                Cancel
              </button>
              <button
                class="btn theme-btn-primary"
                href=""
                @click="createSaveList()"
              >
                Create & Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mx-auto app-container"
        v-if="appState === 'loggedIn'"
        ref="containerRef"
      >
        <!-- Header top Start -->
        <div class="d-flex header-top justify-content-between">
          <img class="" :src="imgUrl" />
          <div class="kompass-name-head">
            <span>KompassAI</span>
          </div>
          <button class="btn m0 p0" @click="backButtonClick()">
            <img class="" :src="maximize" />
          </button>
        </div>
        <!-- Header top End -->

        <!-- Tab Start -->
        <div class="user-tab-info">
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <button
                id="nav-prospect-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-prospect"
                type="button"
                role="tab"
                aria-controls="nav-prospect"
                @aria-selected="selectedTab === 0"
                @click="tabSelect(0)"
                :class="{ active: selectedTab === 0 }"
              >
                Prospect
              </button>
              <button
                id="nav-save-contacts-tab"
                style="font-size: 11.5px"
                data-bs-toggle="tab"
                data-bs-target="#nav-save-contacts"
                type="button"
                role="tab"
                aria-controls="nav-save-contacts"
                @click="tabSelect(1)"
                @aria-selected="selectedTab === 1"
                :class="{ active: selectedTab === 1 }"
              >
                Saved Contacts
              </button>
              <button
                id="nav-history-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-history"
                @click="tabSelect(2)"
                type="button"
                role="tab"
                aria-controls="nav-history"
                @aria-selected="selectedTab === 2"
                :class="{ active: selectedTab === 2 }"
              >
                History
              </button>
              <button
                id="nav-more-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-more"
                type="button"
                role="tab"
                aria-controls="nav-more"
                @aria-selected="selectedTab === 3"
                :class="{ active: selectedTab === 3 }"
              >
                More
              </button>
            </div>
          </nav>
          <div class="tab-content user-content" id="nav-tabContent">
            <div
              class="tab-pane fade show"
              id="nav-prospect"
              role="tabpanel"
              aria-labelledby="nav-prospect-tab"
              :class="{ active: selectedTab === 0, show: selectedTab === 1 }"
            >
              <!-- User Info Start-->
              <div v-if="page_type === SALES_NAV_SEARCH_PATTERN">
                <div class="balance-info-wrapper">
                  <div>
                    <button
                      v-if="scrappedData.length > 0"
                      class="btn theme-btn-primary"
                      style="width: auto; background: white; border:2px solid black;"
                      @click="backToRefresh()"
                    >
                      <img :src="refreshIcon" style="width: 20px; background: white;"/>
                    </button>
                  </div>
                  <div
                    class="balance-info d-flex justify-content-between align-items-center"
                  >
                    <span>Available for today</span>
                    <n-tag
                      :bordered="false"
                      type="info"
                      style="
                        z-index: 99999 !important;
                        padding: 10px 16px 10px 16px;
                        border-radius: 8px;
                      "
                    >
                      <n-tooltip
                        trigger="hover"
                        placement="bottom"
                        class="n-tooltip-overlay"
                        style="z-index: 99999 !important"
                      >
                        <template #trigger>
                          <n-badge
                            value="?"
                            color="black"
                            style="font-size: 16px"
                          >
                            {{ limits }} items
                          </n-badge>
                        </template>
                        Maximum 800 contact views per day. <br />Limit set by
                        Linkedin Sales Navigator.
                      </n-tooltip>
                    </n-tag>
                  </div>
                  <div
                    class="balance-info-wrapper"
                    v-if="salesNavScrappedItems.length"
                  >
                    <div
                      class="balance-info d-flex justify-content-between align-items-center"
                    >
                      <span>Total Items</span>
                      <h4 class="limitday" style="color: #090c05">
                        {{ salesNavScrappedItems.length }}
                      </h4>
                    </div>
                    <div>
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="selectALL"
                        v-model="salesNavSelectALL"
                        @click="selectAllClick"
                      />
                      <label class="form-check-label" for="selectALL"
                        >Select All</label
                      >
                    </div>
                    <div
                      class="scrape-item"
                      v-for="(item, index) in salesNavScrappedItems"
                      :key="item"
                    >
                      <div style="display: flex">
                        <div>
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="'scrapcheck' + index"
                            @click="scrappedItemClicked"
                            v-model="item.checked"
                          />
                          <label
                            class="form-check-label"
                            id="scrapchecklabel"
                            :for="'scrapcheck' + index"
                          ></label>
                        </div>
                        <div class="avatar">
                          <img
                            style="
                              width: 40px;
                              height: 40px;
                              border-radius: 10px;
                            "
                            :src="item['profilePhoto']"
                            v-if="item['profilePhoto']"
                          />
                          <img
                            style="
                              width: 40px;
                              height: 40px;
                              border-radius: 10px;
                              background: #b4b6b9;
                            "
                            :src="nonephoto"
                            v-else
                          />
                        </div>
                        <div
                          class="name-designation"
                          style="width: 200px; margin-left: 15px"
                        >
                          <span>{{ item['profileName'] }}</span>
                          <p>{{ item['headline'] }}</p>
                        </div>
                      </div>
                      <div class="email-address-info">
                        <!-- Email List -->
                        <div
                          class="email-list"
                          v-if="item['emailAddress'] && item['emailAddress']"
                        >
                          <span class="info-items">Email address: </span>
                          <p
                            class="info-item"
                            v-for="it in item['emailAddress']"
                            :key="it"
                          >
                            {{ it }}
                          </p>
                        </div>
                        <div
                          class="email-list"
                          v-if="item['phoneNumbers']"
                          style="margin-top: 20px"
                        >
                          <span class="info-items">Phone: </span>
                          <p
                            class="info-item"
                            v-for="it in item['phoneNumbers']"
                            :key="it"
                          >
                            {{ it }}
                          </p>
                        </div>
                        <div
                          class="join-us-button"
                          v-if="item.emailAddress || item.phoneNumbers"
                        >
                          <button
                            class="theme-btn-stoke d-flex align-items-center justify-content-center"
                            @click="
                              scrapeSelectedItemsCount = 1;
                              saveSalesContactInfo(false, index, item);
                            "
                          >
                            Save Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="balance-info-wrapper" v-else>
                    <div
                      class="balance-info d-flex justify-content-between align-items-center"
                    >
                      <span>Profiles Found</span>
                      <h4 class="limitday" style="color: #090c05">
                        {{ totalItems }}
                      </h4>
                    </div>
                    <div
                      class="search-input search-bg-icon"
                      v-if="totalItems > 25 && scrappedData.length === 0"
                    >
                      <p>Enter total you want to scrape.</p>
                      <!-- <input
                        type="text"
                        class="form-control"
                        placeholder="add number to scrape"
                        v-model="scrapeCounts"
                      /> -->
                      <n-select
                        v-model:value="scrapeCounts"
                        filterable
                        style="width: 25%"
                        placeholder="Please select a song"
                        :options="scrapeCountItems"
                      />
                    </div>
                    <button
                      class="btn theme-btn-primary"
                      @click="scrapingOn"
                      v-if="scrappedData.length === 0 && scrapeCounts > 0"
                    >
                      Scrape Profiles ({{ scrapeCounts }})
                    </button>
                    <div v-if="scrappedData.length">
                      <input
                        class="form-check-input"
                        style="margin-top: 10px"
                        type="checkbox"
                        id="sale-email-checkmark"
                        v-model="emailChecked"
                        @click="selectAllCheckboxClick"
                      />
                      <label
                        class="form-check-label"
                        for="sale-email-checkmark"
                        style="margin-top: 10px"
                        >Email address</label
                      >
                      <input
                        class="form-check-input"
                        style="margin-top: 10px"
                        type="checkbox"
                        v-model="mobileChecked"
                        id="sales-phone-checkmark"
                        @click="selectAllCheckboxClick"
                      />
                      <label
                        class="form-check-label"
                        for="sales-phone-checkmark"
                        style="margin-top: 10px"
                        >Phone</label
                      >

                      <div
                        class="text-center reveal-btn-info"
                        style="margin-top: 20px"
                      >
                        <div>
                          <button
                            class="btn theme-btn-primary"
                            @click="showSelected()"
                          >
                            Reveal Contact Info ({{ scrapeSelectedItemsCount }})
                          </button>
                          <p
                            style="
                              color: #929292;
                              font-size: 14px;
                              text-align: center;
                            "
                          >
                            Please ensure you have an active plan or enough
                            credits
                          </p>
                          <button
                            class="btn theme-btn-primary"
                            @click="deepSearchClicked()"
                          >
                            AI Search
                          </button>
                        </div>
                      </div>
                    </div>
                    <div v-if="scrappedData.length > 0">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="selectALL"
                        v-model="salesNavSelectALL"
                        @click="selectAllCheckboxClick"
                      />
                      <label class="form-check-label" for="selectALL"
                        >Select All</label
                      >
                    </div>
                    <div
                      class="scrape-item"
                      v-for="(item, index) in scrappedData"
                      :key="item"
                    >
                      <div class="item-wrapper">
                        <div>
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="'scrapcheck' + index"
                            @click="scrappedItemClicked"
                            v-model="item.checked"
                          />
                          <label
                            class="form-check-label"
                            id="scrapchecklabel"
                            :for="'scrapcheck' + index"
                          ></label>
                        </div>
                        <div class="avatar">
                          <img
                            style="
                              width: 40px;
                              height: 40px;
                              border-radius: 10px;
                            "
                            :src="item['Profile Photo']"
                            v-if="item['Profile Photo']"
                          />
                          <img
                            style="
                              width: 40px;
                              height: 40px;
                              border-radius: 10px;
                              background: #b4b6b9;
                            "
                            :src="nonephoto"
                            v-else
                          />
                        </div>
                        <div
                          class="name-designation"
                          style="width: 200px; margin-left: 15px"
                        >
                          <span>{{ item['Full Name'] }}</span>
                          <p>{{ item['Job Title'] }}</p>
                        </div>
                      </div>
                      <div class="extra-show-card" v-if="item.revealed">
                        <div class="email-address-info">
                          <!-- Email List -->
                          <div class="email-list" v-if="item['emails']">
                            <p class="info-items">Email address: </p>
                            <span
                              class="info-item"
                              v-for="it in item['emails'].split(',')"
                              :key="it"
                              style="margin-left: 10px"
                            >
                              {{ it }}
                              <n-tag round :bordered="false" type="success">
                                <span style="display: flex; align-items: center; flex-direction: row; justify-content: center;">
                                <img :src="checkmarkIcon" style="width: 25px; height: 25px; margin-top: 5px;"/></img>
                                <span style="font-size: 15px;">Valid</span>
                                </span>
                                
                              </n-tag>
                              <n-tag round :bordered="false" type="info">
                              <span style="display: flex; align-items: center; flex-direction: row; justify-content: center;">
                                <img :src="checkmarkIcon" style="width: 25px; height: 25px; margin-top: 5px;"/></img>
                                <span style="font-size: 15px;">Personal</span>
                                </span>
                              </n-tag>
                              <n-tag round :bordered="false" type="warning">
                              <span style="display: flex; align-items: center; flex-direction: row; justify-content: center;">
                                <img :src="warningIcon" style="width: 25px; height: 25px; margin-top: 5px;"/></img>
                                <span style="font-size: 15px;">Risky</span>
                                </span>
                              </n-tag>
                              <n-tag round :bordered="false" type="error">
                              <span style="display: flex; align-items: center; flex-direction: row; justify-content: center;">
                                <img :src="errorIcon" style="width: 25px; height: 25px; margin-top: 5px;"/></img>
                                <span style="font-size: 15px;">Invalid</span>
                                </span>
                              </n-tag>
                            </span>
                          </div>
                          <div class="email-list" v-else>
                            <span class="info-items">Email address: </span>
                            <p class="info-item">No data available.</p>
                          </div>
                          <div
                            class="email-list"
                            v-if="item['phones'] && item['phones'].length"
                          >
                            <span class="info-items">Phone: </span>
                            <p
                              class="info-item"
                              v-for="it in item['phones'].split(',')"
                              :key="it"
                            >
                              {{ it }}
                            </p>
                          </div>
                          <div class="email-list" v-else>
                            <span class="info-items">Phone: </span>
                            <p class="info-item">No data available.</p>
                          </div>
                          <div
                            class="join-us-button"
                            v-if="item.emails || item.phones"
                          >
                            <button
                              class="btn theme-btn-stoke d-flex align-items-center justify-content-center"
                              @click="saveSalesContactInfo(false, index, item)"
                            >
                              Save Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style="display: inline-block; width: 100%">
                  <n-affix
                    :trigger-bottom="0"
                    position="absolute"
                    class="kps-content-affix"
                    :listen-to="() => containerRef"
                    style="z-index: 999999999"
                  >
                    <n-card
                      v-if="scrappedData.length || salesNavScrappedItems.length"
                    >
                      <div class="join-us-button" v-if="canSave()">
                        <button
                          class="mt-2 btn theme-btn-stoke d-flex align-items-center justify-content-center"
                          @click="
                            saveSalesContactInfo(true, 0, scrappedData[0])
                          "
                        >
                          Save Contacts ({{ scrapeSelectedItemsCount }})
                        </button>
                        <p
                          style="
                            color: #929292;
                            font-size: 14px;
                            text-align: center;
                          "
                        >
                          Only enriched contacts can be saved
                        </p>
                      </div>
                    </n-card>
                  </n-affix>
                </div>
              </div>
              <div v-if="page_type === SALES_NAV" class="feedpage-noti">
                Please navigate to a profile page, a leads list, or search for
                contacts via a filter.
              </div>
              <div v-if="page_type === FEEDPAGE" class="feedpage-noti">
                Go to Profile, Company or Navigator Page to Start Prospecting
              </div>
              <div
                v-if="
                  page_type === 'REGULAR_COMPANY' ||
                  page_type === 'SALES_COMPANY'
                "
              >
                <div class="info-details">
                  <!-- User Avatar Start -->
                  <div class="user-avatar">
                    <div class="avatar">
                      <img
                        :src="companyLogo"
                        style="height: 54px; width: 54px; border-radius: 10px"
                        v-if="companyLogo"
                      />
                      <img
                        :src="companyImg"
                        style="height: 54px; width: 54px; border-radius: 10px"
                        v-else
                      />
                    </div>
                    <div class="user-name-info">
                      <h3>{{ companyName }}</h3>
                      <span>{{ tagLine }}</span>
                    </div>
                    <div class="bookmark-badge">
                      <img :src="bookmark_border" @click="saveCompanyData()" />
                    </div>
                  </div>
                  <!-- User Avatar End -->
                </div>
                <div class="company-tab">
                  <div class="tab-content company-content" id="nav-tabContent">
                    <div
                      class="tab-pane fade show active"
                      id="nav-company"
                      role="tabpanel"
                      aria-labelledby="nav-company-tab"
                    >
                      <div class="tab-company-details">
                        <div class="company-short-info">
                          <p
                            class="text-container"
                            id="text"
                            :style="{
                              maxHeight: isExpanded ? 'none' : maxHeight,
                            }"
                          >
                            {{ cpAbout }}
                          </p>
                          <strong
                            id="moreBtn"
                            @click="isExpanded = !isExpanded"
                            >{{ isExpanded ? 'Less' : 'More' }}</strong
                          >
                        </div>
                        <div class="company-social-icons">
                          <div class="social-links">
                            <img :src="linkedin" @click="openLinkedin" />
                            <img :src="link" @click="openWebpage" />
                          </div>
                        </div>
                        <div class="box-grid-layout">
                          <div class="box">
                            <div class="box-icon">
                              <img :src="person" />
                              <span>Employees</span>
                            </div>
                            <div>
                              <div
                                class="box-caption"
                                v-if="Number(employeeCount) !== 0"
                              >
                                <h4>{{ employeeCount }}</h4>
                              </div>
                              <div class="box-caption" v-else>
                                <h4>
                                  {{ employeeCountRange.start }} -
                                  {{ employeeCountRange.end }}
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div class="box">
                            <div class="box-icon">
                              <img :src="assistant_photo" />
                              <span>Founded</span>
                            </div>
                            <div class="box-caption">
                              <h4>{{ yearFounded ? yearFounded : '-' }}</h4>
                            </div>
                          </div>
                          <div class="box">
                            <div class="box-icon">
                              <img :src="fmd_good" />
                              <span>Location</span>
                            </div>
                            <div class="box-caption">
                              <h4>{{ cplocation }}</h4>
                            </div>
                          </div>
                          <div class="box">
                            <div class="box-icon">
                              <img :src="attach_money" />
                              <span> Annual revenue</span>
                            </div>
                            <div class="box-caption">
                              <h4>-</h4>
                            </div>
                          </div>
                          <div class="box box-wide">
                            <div class="box-icon">
                              <img :src="home_work" />
                              <span>Industry</span>
                            </div>
                            <div class="box-caption">
                              <h4>{{ industryTags }}</h4>
                            </div>
                          </div>
                          <div class="box box-wide">
                            <div class="box-icon">
                              <img :src="domain" />
                              <span>Specialties</span>
                            </div>
                            <div class="box-caption">
                              <!-- Skill Tags Start -->
                              <ul class="skill-tags">
                                <li v-for="item in specialities" :key="item">
                                  <span>{{ item }}</span>
                                </li>
                              </ul>
                              <!-- Skill Tags End -->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="tab-pane fade"
                      id="nav-save-employees"
                      role="tabpanel"
                      aria-labelledby="nav-save-employees-tab"
                    >
                      <div class="employee-filter">
                        <!--start Filter search input -->
                        <div
                          class="mb-4 filter-search d-flex align-items-center justify-content-between"
                        >
                          <div class="search-input search-bg-icon">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Search by filter"
                            />
                          </div>
                          <div class="filter-modal-button">
                            <button
                              class="btn theme-btn-stoke d-flex align-items-center"
                              data-bs-toggle="modal"
                              data-bs-target="#filterModal"
                            >
                              <img :src="filter_alt" />Filter
                            </button>
                          </div>
                        </div>
                        <!--end Filter search input -->

                        <!--Filter As Modal -->
                        <div
                          class="modal fade filter-as-modal"
                          id="filterModal"
                          data-bs-backdrop="static"
                          data-bs-keyboard="false"
                          tabindex="-1"
                          aria-labelledby="staticRevealLabel"
                          aria-hidden="true"
                        >
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title" id="staticRevealLabel">
                                  Filters
                                </h5>
                                <button
                                  type="button"
                                  class="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div class="modal-body">
                                <div class="filter-as-wrapper">
                                  <div
                                    class="accordion"
                                    id="accordionPanelsStayFilter"
                                  >
                                    <div class="accordion-item">
                                      <h2
                                        class="accordion-header"
                                        id="panelsStayOpen-departMent"
                                      >
                                        <button
                                          class="accordion-button"
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#panelsStayOpen-collapseDepartment"
                                          aria-expanded="true"
                                          aria-controls="panelsStayOpen-collapseDepartment"
                                        >
                                          Department
                                        </button>
                                      </h2>
                                      <div
                                        id="panelsStayOpen-collapseDepartment"
                                        class="accordion-collapse collapse show"
                                        aria-labelledby="panelsStayOpen-departMent"
                                      >
                                        <div class="accordion-body">
                                          <div class="form-checkbox-email">
                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  id="email-checkmarkModal1"
                                                />
                                                <label
                                                  for="email-checkmarkModal1"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>
                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  id="email-checkmarkModal2"
                                                />
                                                <label
                                                  for="email-checkmarkModal2"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>
                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  id="email-checkmarkModal3"
                                                />
                                                <label
                                                  for="email-checkmarkModal3"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>
                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  checked
                                                  id="email-checkmarkModal7"
                                                />
                                                <label
                                                  for="email-checkmarkModal7"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>

                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  checked
                                                  id="email-checkmarkModal8"
                                                />
                                                <label
                                                  for="email-checkmarkModal8"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="accordion-item">
                                      <h2
                                        class="accordion-header"
                                        id="panelsStayOpen-seniority"
                                      >
                                        <button
                                          class="accordion-button collapsed"
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#panelsStayOpen-collapseSeniority"
                                          aria-expanded="false"
                                          aria-controls="panelsStayOpen-collapseSeniority"
                                        >
                                          Seniority
                                        </button>
                                      </h2>
                                      <div
                                        id="panelsStayOpen-collapseSeniority"
                                        class="accordion-collapse collapse"
                                        aria-labelledby="panelsStayOpen-seniority"
                                      >
                                        <div class="accordion-body">
                                          <div class="form-checkbox-email">
                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  id="email-checkmarkModal10"
                                                />
                                                <label
                                                  for="email-checkmarkModal10"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>
                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  id="email-checkmarkModal11"
                                                />
                                                <label
                                                  for="email-checkmarkModal11"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>

                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  id="email-checkmarkModal13"
                                                />
                                                <label
                                                  for="email-checkmarkModal13"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>

                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  checked
                                                  id="email-checkmarkModal14"
                                                />
                                                <label
                                                  for="email-checkmarkModal14"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>

                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  checked
                                                  id="email-checkmarkModal15"
                                                />
                                                <label
                                                  for="email-checkmarkModal15"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="accordion-item">
                                      <h2
                                        class="accordion-header"
                                        id="panelsStayOpen-contactLocation"
                                      >
                                        <button
                                          class="accordion-button collapsed"
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#panelsStayOpen-collapseContact"
                                          aria-expanded="false"
                                          aria-controls="panelsStayOpen-collapseContact"
                                        >
                                          Contact location
                                        </button>
                                      </h2>
                                      <div
                                        id="panelsStayOpen-collapseContact"
                                        class="accordion-collapse collapse"
                                        aria-labelledby="panelsStayOpen-contactLocation"
                                      >
                                        <div class="accordion-body">
                                          <div class="form-checkbox-email">
                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  id="email-checkmarkModal111"
                                                />
                                                <label
                                                  for="email-checkmarkModal111"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>

                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  id="email-checkmarkModal21"
                                                />
                                                <label
                                                  for="email-checkmarkModal21"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>

                                            <div class="email-checkbox">
                                              <div
                                                class="form-checkmark d-flex align-items-center"
                                              >
                                                <input
                                                  type="checkbox"
                                                  class="checkbox"
                                                  value=""
                                                  id="email-checkmarkModal31"
                                                />
                                                <label
                                                  for="email-checkmarkModal31"
                                                >
                                                  Email address
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                class="modal-footer d-flex justify-content-between"
                              >
                                <button
                                  type="button"
                                  data-bs-dismiss="modal"
                                  class="btn btn-secondary"
                                >
                                  Clear
                                </button>
                                <a class="btn theme-btn-primary" href="">
                                  Show Results</a
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="mt-2 mb-2 info-details"
                          v-for="item in employees"
                          :key="item.name"
                        >
                          <div
                            class="user-avatar d-flex justify-content-start align-items-center"
                          >
                            <div class="avatar">
                              <img
                                :src="item.photo"
                                style="
                                  height: 54px;
                                  width: 54px;
                                  border-radius: 10px;
                                "
                                v-if="item.photo"
                              />
                            </div>
                            <div class="user-name-info" style="width: 250px">
                              <h3>{{ item.name }}</h3>
                              <span
                                >{{ item.headline }} <br />
                                {{ item.location }}</span
                              >
                            </div>
                            <div class="bookmark-badge">
                              <img
                                class="mx-1 img-fluid"
                                :src="bookmark_border"
                              />
                              <img :src="keyboard_arrow_right" />
                            </div>
                          </div>
                          <!-- User Avatar End -->
                          <ul class="skill-tags">
                            <li v-for="it in item.skills" :key="it">
                              <span>{{ it }}</span>
                            </li>
                          </ul>

                          <!-- Skill Tags End -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="
                  page_type === 'REGULAR_PROFILE' ||
                  page_type === 'LEAD_PROFILE'
                "
              >
                <div class="info-details">
                  <!-- User Avatar Start -->
                  <div
                    class="user-avatar d-flex justify-content-start align-items-center"
                  >
                    <div class="avatar">
                      <!-- <img :src="avatar" />      -->
                      <img
                        :src="profilePhoto"
                        style="height: 54px; width: 54px; border-radius: 10px"
                        v-if="profilePhoto"
                      />
                    </div>
                    <div class="user-name-info" style="width: 250px">
                      <h3>{{ profileName }}</h3>
                      <span>{{ headline }}</span>
                    </div>
                    <div
                      class="bookmark-badge"
                      @click="saveContactInfo()"
                      v-if="emailAddress.length || phoneNumbers.length"
                    >
                      <img :src="bookmark_border" />
                    </div>
                  </div>
                  <!-- User Avatar End -->
                </div>
                <!-- Skill Tags Start -->
                <div v-if="skills.length > 5">
                  <ul class="skill-tags" v-if="isExpand">
                    <li v-for="item in skills" :key="item">
                      <span>{{ item }}</span>
                    </li>
                    <strong
                      id="moreBtn"
                      v-if="skills.length > 5"
                      @click="isExpand = !isExpand"
                      >{{ isExpand ? 'Less' : 'Expand' }}</strong
                    >
                  </ul>
                  <ul class="skill-tags" v-else>
                    <li v-for="item in skills.slice(0, 5)" :key="item">
                      <span>{{ item }}</span>
                    </li>
                    <strong
                      id="moreBtn"
                      v-if="skills.length > 5"
                      @click="isExpand = !isExpand"
                      >{{ isExpand ? 'Less' : 'Expand' }}</strong
                    >
                  </ul>
                </div>
                <ul class="skill-tags" v-else>
                  <li v-for="item in skills" :key="item">
                    <span>{{ item }}</span>
                  </li>
                  <strong
                    id="moreBtn"
                    v-if="skills.length > 5"
                    @click="isExpand = !isExpand"
                    >{{ isExpand ? 'Less' : 'Expand' }}</strong
                  >
                </ul>

                <!-- Skill Tags End -->
                <!-- User Info End-->

                <!-- Email Address List Start -->
                <div class="email-address-info">
                  <!-- Email List -->
                  <div class="email-list-wrapper">
                    <div class="email-list">
                      <div
                        :class="[
                          isSales ? 'email-checkbox-sales' : 'email-checkbox',
                        ]"
                      >
                        <input
                          type="checkbox"
                          class="checkbox"
                          value=""
                          checked
                          :id="
                            isSales ? 'email-checkmark-blue' : 'email-checkmark'
                          "
                          v-model="emailChecked"
                        />
                        <label
                          :for="
                            isSales ? 'email-checkmark-blue' : 'email-checkmark'
                          "
                        >
                          Email address <br />
                        </label>
                      </div>
                    </div>
                    <div class="email-list">
                      <div
                        :class="[
                          isSales ? 'email-checkbox-sales' : 'email-checkbox',
                        ]"
                      >
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          v-model="mobileChecked"
                          :id="
                            isSales ? 'phone-checkmark-blue' : 'phone-checkmark'
                          "
                        />
                        <label
                          class="form-check-label"
                          :for="
                            isSales ? 'phone-checkmark-blue' : 'phone-checkmark'
                          "
                          >Phone</label
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Reveal Button start-->
                  <div class="reveal-btn-info">
                    <div>
                      <button
                        class="theme-btn-primary"
                        @click="revealContactInfo"
                      >
                        Reveal Contact Info
                      </button>
                      <p>
                        Please ensure you have an active plan or enough credits
                      </p>
                    </div>
                  </div>
                  <!-- Email List -->
                  <div
                    v-if="revealedName === profileName"
                    class="email-address-info-list"
                  >
                    <div class="email-list" v-if="revealedOptions.emailChecked">
                      <span class="info-items">Email address: </span>
                      <div v-if="emailAddress.length">
                        <p
                          class="info-item"
                          v-for="item in emailAddress"
                          :key="item"
                        >
                          {{ item }}
                        </p>
                      </div>
                      <div v-else>
                        <p class="info-item">No data available.</p>
                      </div>
                    </div>

                    <div
                      class="email-list"
                      v-if="revealedOptions.mobileChecked"
                    >
                      <span class="info-items">Phone: </span>
                      <div v-if="phoneNumbers.length">
                        <p
                          class="info-item"
                          v-for="item in phoneNumbers"
                          :key="item"
                        >
                          {{ item }}
                        </p>
                      </div>
                      <div v-if="!phoneNumbers.length">
                        <p class="info-item">No data available.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Email Address List End -->

                <div
                  class="text-center reveal-btn-info"
                  v-if="emailAddress.length || phoneNumbers.length"
                >
                  <Button
                    class="btn theme-btn-primary"
                    @click="saveContactInfo"
                    severity="secondary"
                    text
                    raised
                  >
                    Save Contact
                  </Button>
                </div>
                <div class="kompass-ai-info" v-if="companyName">
                  <!-- Company Info start-->
                  <div class="kompass-company-info">
                    <div class="company-logo">
                      <img :src="companyLogo" v-if="companyLogo" />
                      <img :src="companyImg" v-else />
                    </div>
                    <div class="kompass-name-info">
                      <h3>{{ companyName }}</h3>
                      <span>{{ tagLine }}</span>
                    </div>
                    <div class="social-links">
                      <span @click="openPage(companyUrl)"
                        ><img :src="linkedIn"
                      /></span>
                      <span @click="openPage(cpUrl)"><img :src="link" /></span>
                      <img :src="bookmark_border1" @click="saveCompanyData()" />
                    </div>
                  </div>
                  <div class="company-short-info">
                    <p>
                      {{ isTruncated ? truncatedText : cpAbout }}
                    </p>
                    <strong
                      id="moreBtn"
                      v-if="cpAbout.length >= 250"
                      @click="isTruncated = !isTruncated"
                      >{{ isTruncated ? 'Show More' : 'Show Less' }}</strong
                    >
                  </div>

                  <div class="date-meta" v-if="experiences.length">
                    <p>{{ experiences[0].caption }}</p>
                  </div>
                  <div class="box-grid-layout">
                    <div class="box">
                      <div class="box-icon">
                        <img :src="person" />
                        <span>Employees</span>
                      </div>
                      <div class="box-caption">
                        <h4>{{ employeeCount ? employeeCount : '-' }}</h4>
                      </div>
                    </div>
                    <div class="box">
                      <div class="box-icon">
                        <img :src="assistant_photo" />
                        <span>Founded</span>
                      </div>
                      <div class="box-caption">
                        <h4>{{ yearFounded ? yearFounded : '-' }}</h4>
                      </div>
                    </div>
                    <div class="box">
                      <div class="box-icon">
                        <img :src="fmd_good" />
                        <span>Location</span>
                      </div>
                      <div class="box-caption">
                        <h4>{{ cplocation ? cplocation : '-' }}</h4>
                      </div>
                    </div>
                    <div class="box">
                      <div class="box-icon">
                        <img :src="watch_later" />
                        <span>Work Time</span>
                      </div>
                      <div class="box-caption">
                        <h4>8:00 - 16:00</h4>
                      </div>
                    </div>
                  </div>

                  <div class="experience-company">
                    <h2 class="experience-title">Experience</h2>
                    <div
                      class="kompass-company-info"
                      v-for="item in experiences"
                      :key="item.entityUrn"
                    >
                      <div class="company-logo">
                        <img
                          :src="item.logoUrl"
                          style="width: 40px"
                          v-if="item.logoUrl"
                        />
                        <img :src="companyImg" style="width: 40px" v-else />
                      </div>
                      <div class="kompass-name-info">
                        <h3>{{ item.title }}</h3>
                        <span>{{ item.subtitle }}</span>
                        <ul
                          class="kompass-experience-info"
                          v-if="item.subSkills"
                        >
                          <li v-for="it in item.subSkills" :key="it.title">
                            <h3>{{ it.title }}</h3>
                            <span>{{ it.caption }}</span>
                          </li>
                        </ul>
                        <span class="kompass-experience-info" v-else>
                          {{ item.caption }}
                        </span>
                      </div>
                      <div class="social-links">
                        <a :href="item.companyUrl"> <img :src="linkedIn" /></a>
                        <img
                          :src="bookmark_border1"
                          @click="saveCompany(item)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="nav-save-contacts"
              role="tabpanel"
              aria-labelledby="nav-save-contacts-tab"
              :class="{ active: selectedTab === 1, show: selectedTab === 1 }"
            >
              <h2 class="search-title">Saved Contacts</h2>
              <div class="leads-tabs">
                <button
                  :class="['nav-link', selectedleads === 0 ? 'active' : '']"
                  @click="contactSelect(0)"
                >
                  Contacts
                </button>
                <button
                  :class="['nav-link', selectedleads === 1 ? 'active' : '']"
                  @click="contactSelect(1)"
                >
                  Companies
                </button>
              </div>
              <Contact
                v-if="contactClickedItem"
                :profileData="contactClickedItem"
                :isSales="isSales"
                @close="contactHandleClose"
                @saveCompany="saveCompany"
                ref="contactEle"
                @setLoading="leadLoadingSet"
                @loadContacts="loadContacts(true)"
              >
              </Contact>
              <Company
                v-if="companyClickedItem"
                :profileData="companyClickedItem"
                @close="contactHandleClose"
                ref="contactEle"
                @setLoading="leadLoadingSet"
              >
              </Company>
              <div
                class="employee-filter"
                v-if="
                  !companyClickedItem &&
                  !contactClickedItem &&
                  selectedleads === 0
                "
              >
                <div
                  class="filter-search d-flex align-items-center justify-content-between"
                >
                  <div class="search-input search-bg-icon">
                    <img :src="searchIcon" />
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search by Name"
                      v-model="contactSearchFilterText"
                    />
                  </div>
                </div>
                <div class="save-list">
                  <select
                    class="form-select form-select-lg"
                    aria-label=".form-select-lg example"
                    v-model="selectedContactsTitle"
                  >
                    <option
                      :value="item"
                      v-for="item in contactsTitleList"
                      :key="item"
                    >
                      {{ item }}
                    </option>
                  </select>
                </div>
                <div class="search-user-list employee-filter">
                  <div
                    class="info-details"
                    v-for="item in contactSearchedData"
                    @click="contactClicked(item)"
                    :key="item"
                  >
                    <div class="user-avatar">
                      <div class="user-name-info">
                        <h3>{{ item.name }}</h3>
                        <span
                          >{{ item.title }}, {{ item.company.name }} <br />
                          {{ item.location }}</span
                        >
                      </div>
                      <div class="bookmark-badge">
                        <img class="mx-1 img-fluid" :src="bookmark" />
                        <img :src="keyboard_arrow_right" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="employee-filter"
                v-if="
                  !companyClickedItem &&
                  !contactClickedItem &&
                  selectedleads === 1
                "
              >
                <div
                  class="mb-4 filter-search d-flex align-items-center justify-content-between"
                >
                  <div class="search-input search-bg-icon">
                    <img :src="searchIcon" />
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search by Name"
                      v-model="contactSearchFilterText"
                    />
                  </div>
                </div>
                <div class="search-user-list employee-filter">
                  <div
                    class="info-details"
                    v-for="item in companySearchedData"
                    @click="companyClicked(item)"
                    :key="item"
                  >
                    <div
                      class="user-avatar d-flex justify-content-start align-items-center"
                    >
                      <div class="avatar">
                        <img
                          :src="item.companyDetail.logo"
                          style="height: 54px; width: 54px; border-radius: 10px"
                          v-if="item.companyDetail.logo"
                        />
                        <img
                          :src="companyImg"
                          style="height: 54px; width: 54px; border-radius: 10px"
                          v-else
                        />
                      </div>
                      <div class="user-name-info company-info">
                        <h3>{{ item.companyName }}</h3>
                        <span v-if="item.companyDetail.about">{{
                          item.companyDetail.about
                        }}</span>
                      </div>
                      <div class="bookmark-badge">
                        <img class="mx-1 img-fluid" :src="bookmark" />
                        <img :src="keyboard_arrow_right" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="nav-history"
              role="tabpanel"
              aria-labelledby="nav-history-tab"
              :class="{ active: selectedTab === 2, show: selectedTab === 2 }"
            >
              <div class="history-content-info">
                <History
                  v-if="historyClickedItem"
                  :profileData="historyClickedItem"
                  @saveContactInfo="saveContactInfo"
                  @saveCompany="saveCompany"
                  @setLoading="leadLoadingSet"
                  @updateHistoryClickedItem="updateHistoryClickedItem"
                  @close="handleClose"
                  ref="HistoryEle"
                ></History>
                <div class="search-header" v-if="!historyClickedItem">
                  <h2 class="search-title">Search History</h2>
                  <div class="search-field">
                    <img class="search-bg-icon" :src="searchIcon" />
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search by name"
                      v-model="searchText"
                    />
                  </div>
                </div>
                <div class="search-user-list" v-if="!historyClickedItem">
                  <span class="recent-title">
                    <img :src="update" /> Recent Searches</span
                  >
                  <!-- Repeat item list -->
                  <div v-if="searchText">
                    <div
                      class="search-user-item"
                      v-for="item in searchedData"
                      :key="item"
                    >
                      <div class="avatar">
                        <img
                          class="clicker"
                          style="width: 40px; height: 40px; border-radius: 10px"
                          :src="item.profilePhoto"
                          @click="historyClicked(item)"
                        />
                      </div>
                      <div
                        class="name-designation clicker"
                        @click="historyClicked(item)"
                      >
                        <span>{{ item.profileName }}</span>
                        <p>{{ item.headline }}</p>
                      </div>
                      <div
                        class="bookmark-badge"
                        v-if="
                          item.profile.emailAddress.length ||
                          item.profile.phoneNumbers.length
                        "
                      >
                        <img
                          class="img-fluid clicker"
                          :src="bookmark_border"
                          @click="saveContactInfo()"
                        />
                        <img
                          class="img-fluid clicker"
                          :src="keyboard_arrow_right"
                          @click="historyClicked(item)"
                        />
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div
                      class="search-user-item"
                      v-for="item in searchHistory"
                      :key="item"
                    >
                      <div class="avatar">
                        <img
                          class="clicker"
                          style="width: 40px; height: 40px; border-radius: 10px"
                          :src="item.profilePhoto"
                          @click="historyClicked(item)"
                        />
                      </div>
                      <div
                        class="name-designation clicker"
                        @click="historyClicked(item)"
                      >
                        <span>{{ item.profileName }}</span>
                        <p>{{ item.headline }}</p>
                      </div>
                      <div
                        class="bookmark-badge"
                        v-if="
                          item.profile.emailAddress.length ||
                          item.profile.phoneNumbers.length
                        "
                      >
                        <img
                          class="img-fluid clicker"
                          :src="bookmark_border"
                          @click="saveContactInfo()"
                        />
                        <img
                          class="img-fluid clicker"
                          :src="keyboard_arrow_right"
                          @click="historyClicked(item)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <MoreTab
              :kBrand="k_brand"
              :linkedin="linkedin"
              :toc="toc"
              :arrowCircleLeft="arrow_circle_left"
              :arrowCircleRight="arrow_circle_right"
              :integrationInstructions="integration_instructions"
              :rightUrl="right_url"
              :supervisorAccount="supervisor_account"
              :isSales="isSales"
              :selectedTab="selectedTab"
              :OnLogout="onLogout"
              :joinUs="joinUs"
              :visitKompassAI="visitKompassAI"
              :listsInKompassAI="listsInKompassAI"
              :gotoHelpCenter="gotoHelpCenter"
              :gotoPrivacy="gotoPrivacy"
              :gotoIntegration="gotoIntegration"
              :moveLeft="moveLeft"
              :moveRight="moveRight"
            />
          </div>
        </div>
        <BalanceInfo
          @setLoading="leadLoadingSet"
          @setCredits="setCredits"
          @updateCredits="updateCredits"
          @buyCredits="buyCredits"
          :emailCredits="emailCredits"
          :phoneCredits="phoneCredits"
        />
        <!-- Your Balance Info -->
      </div>
      <WelcomePage
        :imgUrl="imgUrl"
        :maximize="maximize"
        :appState="appState"
        :backButtonClick="backButtonClick"
        :gotoLogin="gotoLogin"
        :gotoRegister="gotoRegister"
      />
      <AuthPage
        :imgUrl="imgUrl"
        :maximize="maximize"
        :appState="appState"
        :userEmail="userEmail"
        :userPassword="userPassword"
        :isSales="isSales"
        :backButtonClick="backButtonClick"
        :login="login"
        :gotoRegister="gotoRegister"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import WelcomePage from './Components/WelcomePage.vue';
import AuthPage from './Components/AuthPage.vue';
import Affix from './Components/Affix.vue';
//@ts-ignore
import BalanceInfo from './Components/BalanceInfo.vue';
import MoreTab from './Tabs/MoreTab.vue';
import { onMounted, ref, watchEffect, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '../store/profileData';
import {
  getDataFromStorage,
  setDataToStorage,
  pageType,
  SALES_NAV_SEARCH_PATTERN,
  SALES_NAV,
  getIdentity,
  getList,
  createList,
  uploadPerson,
  saveContact,
  saveSalesNav,
  contactLoadAPI,
  FEEDPAGE,
  saveFavourite,
  getFavourites,
  loadCompanyData,
  loadProfile,
  loadSalesProfile,
  sendInstallRequest,
  getCredits,
  waitElement,
  loadSaleNavProfile,
  getRevealInfo,
  saveMultiContact,
  saveToCRMContact,
} from '../utils/utils';
//@ts-ignore
import History from './Components/History.vue';
//@ts-ignore
import NewHistory from './Components/NewHistory.vue';
//@ts-ignore
import Contact from './Components/Contact.vue';
//@ts-ignore
import Company from './Components/Company.vue';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { useToast } from 'vue-toastification';

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
const appData = useProfileStore();
const {
  showCE,
  contactInfo,
  companyData,
  skills,
  experiences,
  scrapingDone,
  salesData,
  commands,
  salesTotal,
  dlimits,
  btnAdded,
} = storeToRefs(appData);
const toast = useToast();

const loggedIn = ref('');
const appState: any = ref('welcome');

// selected history item
const historyClickedItem: any = ref(null);
// selected contact item - contacts
const contactClickedItem: any = ref(null);
// selected contact item - company
const companyClickedItem: any = ref(null);

//ref for the contact element
const contactEle: any = ref(null);
const HistoryEle: any = ref(null);
const isSales = ref(false);

const cpUrl = ref('');
const page_type = ref('REGULAR_PROFILE');
const selectedTab = ref(0);

// saved leads internal tab 0 - contacts, 1 - companies
const selectedleads = ref(0);

const emailChecked = ref(true);
const mobileChecked = ref(true);
const emailAddress: any = ref([]);
const phoneNumbers: any = ref([]);

const historyEmailAddress: any = ref([]);
const historyPhoneNumbers: any = ref([]);

const userEmail: any = ref('');
const userPassword: any = ref('');
const currentUser = ref();
const userPool = ref();
const scrapingLimit = ref(800);

const pUrl = ref('');
const isLoading = ref(false);
const fullPage = ref(false);
const cpAbout = ref('');
const employeeCount = ref('');
const industryContent = ref('');
const industryTags = ref('');
const yearFounded = ref('');
const country = ref('');
const countryCode = ref('');
const profilePhoto = ref('');
const profileName = ref('');
const revealedName = ref('');
const revealedOptions = ref({ emailChecked: false, mobileChecked: false });
const companyName = ref('');
const isExpanded = ref(false);
const maxHeight = '90px'; // Adjust as needed
const specialities = ref([]);
const employees: any = ref([]);
const tagLine = ref('');
const companyUrl = ref('');
const profileUrl = ref('');
const headline = ref('');
const location = ref('');
const headquarte = ref('');
const moneyRaised = ref('');
const moneyRaisedUnits = ref('');
const employeeCountRange: any = ref();
const companyLogo = ref('');
const location_1 = ref('');
const cplocation = ref('');
const scrapeCounts = ref(0);
const scrapeCountItems = ref([
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  { value: '75', label: '75' },
  { value: '100', label: '100' },
  { value: '125', label: '125' },
  { value: '150', label: '150' },
  { value: '175', label: '175' },
  { value: '200', label: '200' },
  { value: '225', label: '225' },
  { value: '250', label: '250' },
  { value: '275', label: '275' },
  { value: '300', label: '300' },
  { value: '325', label: '325' },
  { value: '350', label: '350' },
  { value: '375', label: '375' },
  { value: '400', label: '400' },
  { value: '425', label: '425' },
  { value: '450', label: '450' },
  { value: '475', label: '475' },
  { value: '500', label: '500' },
  { value: '525', label: '525' },
  { value: '550', label: '550' },
  { value: '575', label: '575' },
  { value: '600', label: '600' },
  { value: '625', label: '625' },
  { value: '650', label: '650' },
  { value: '675', label: '675' },
  { value: '700', label: '700' },
  { value: '725', label: '725' },
  { value: '750', label: '750' },
  { value: '775', label: '775' },
  { value: '800', label: '800' },
]);
const multi = ref(false);
const scrappedData: any = ref([]);
const status = ref(0);
const scrapingStatus = ref('');
const limits = ref(833);
const searchText = ref('');
// field for creating list title.
const createListName = ref('');
//history data
const searchedData: any = ref([]);
//saving folder list
const savedFolderList: any = ref([]);
//default saved list name
const selectedListOption: any = ref('');
// save contacts folder list
const contactsTitleList: any = ref(['All Contacts']);
const contactsData: any = ref([]);

const searchHistory: any = ref([]);
const align: any = ref('');

//selected folder name
const selectedContactsTitle: any = ref('All Contacts');
const credits: any = ref(true);
const emailCredits: any = ref(0);
const phoneCredits: any = ref(0);
// save contacts filter
const contactSearchFilterText = ref('');
const contactSearchedData: any = ref([]);
const companySearchedData: any = ref([]);
// saved lead data
const selectedContactsData: any = ref([]);
const favoriteCompanyData: any = ref([]);
// select the scrapped items from the salesNav Search page
const scrapeSelectedItemsCount: any = ref(0);
const salesNavSelectALL: any = ref(false);

// edit salesNav scrapped item
const salesNavEditItem: any = ref({});
const salesNavEditItemIndex: any = ref();

const contentView: any = ref(null);

const isTruncated = ref(true);
const isExpand = ref(false);
const totalItems = ref(0);

const salesNavselectedItems: any = ref([]);
const salesNavScrappedItems: any = ref([]);

const isSaleNavList: any = ref(false);

const truncatedText = computed(() =>
  isTruncated.value ? cpAbout.value.slice(0, 250) : cpAbout.value,
);
const containerRef = ref<HTMLElement | undefined>(undefined);
const moveLeft = () => {
  if (contentView.value.style.right) {
    contentView.value.style.right = '';
  }
  contentView.value.style.left = '0';
  setDataToStorage({ align: 'left' });
  align.value = 'left';
};

const moveRight = () => {
  if (contentView.value.style.left) {
    contentView.value.style.left = '';
  }
  contentView.value.style.right = '0';
  setDataToStorage({ align: 'right' });
  align.value = 'right';
};

const canSave = () => {
  for (const item of scrappedData.value)
    if (item.checked && (item.emails || item.phones)) return true;
  for (const item of salesNavScrappedItems.value) if (item.checked) return true;

  return false;
};

const updateCredits = async () => {
  let flag = false;
  if (isLoading.value) flag = true;
  isLoading.value = true;
  const credits = await getCredits();
  if (credits && credits.data) {
    emailCredits.value = credits.data.emails;
    phoneCredits.value = credits.data.phones;
  }
  if (!flag) isLoading.value = false;
};

const buyCredits = async () => {
  isLoading.value = true;
  const credits = await getCredits();
  if (credits && credits.data) {
    emailCredits.value = credits.data.emails;
    phoneCredits.value = credits.data.phones;
  }
  // if (credits.data.emails == 0 || credits.data.phones == 0) {
  window.open('https://kompassai.com/upgrade', '_blank');
  // }
  isLoading.value = false;
};
const handleClose = async () => {
  historyClickedItem.value = null;
};
// Show button click on the salesNav search page.
const showSelected = async () => {
  if (scrapeSelectedItemsCount.value === 0)
    return toast.info('Please select a contact.');
  else {
    credits.value = true;
    isLoading.value = true;
    for (let i = 0; i < scrappedData.value.length; i++) {
      const dd = scrappedData.value[i];
      // console.log(i, dd, dd.checked)
      if (!credits.value) break;
      if (dd.checked) {
        await new Promise(resolve => {
          revealScrappedItemContactInfo(i, dd).then(() => resolve(null));
        });
      }
    }
    isLoading.value = false;
  }
  await updateCredits();
};

// ai search button clicked
const deepSearchClicked = async () => {
  console.log("1111111111111");
  if (scrapeSelectedItemsCount.value === 0)
    return toast.info('Please select a contact.');
  else {
    credits.value = true;
    isLoading.value = true;
    for (let i = 0; i < scrappedData.value.length; i++) {
      const dd = scrappedData.value[i];
      // console.log(i, dd, dd.checked)
      if (!credits.value) break;
      if (dd.checked) {
        await new Promise(resolve => {
          deepSearchItemContactInfo(i, dd).then(() => resolve(null));
        });
      }
    }
    isLoading.value = false;
  }
  await updateCredits();
  console.log(scrappedData);

};

// back to contact page
const contactHandleClose = async () => {
  contactClickedItem.value = null;
};

const setCredits = async (credits: any) => {
  emailCredits.value = credits.data.emails;
  phoneCredits.value = credits.data.phones;
};
const getCurrentTimestamp = () => {
  return Date.now();
};

const updateToken = async () => {
  const savedTimestamp = parseInt(await getDataFromStorage('savedtime')) || 0;
  var currentTimestamp = getCurrentTimestamp();
  var timeDifference = currentTimestamp - savedTimestamp;
  console.log('updateToken --- ', timeDifference);
  var oneHourInMilliseconds = 3600000; // 1 hour = 3600 seconds * 1000 milliseconds
  if (timeDifference > oneHourInMilliseconds) {
    const token = await getSession();
    // @ts-ignore
    setDataToStorage({ idToken: token?.idToken.jwtToken });
    setDataToStorage({ savedtime: currentTimestamp });
    console.log('Current timestamp saved successfully.');
  }
};

const revealScrappedItemContactInfo = async (idex: any, e: any) => {
  salesNavEditItemIndex.value = idex;
  salesNavEditItem.value = e;
  if (
    salesNavEditItem.value.linkedinUrl === '' ||
    salesNavEditItem.value.linkedinUrl === undefined
  )
    await loadSalesProfile(0, salesNavEditItem.value['profile url'], appData);
  else await loadProfile(0, salesNavEditItem.value.linkedinUrl, appData);
  const dataToSave = await JSON.stringify({
    cpUrl: cpUrl.value,
    cpAbout: cpAbout.value,
    employeeCount: employeeCount.value,
    yearFounded: yearFounded.value,
    country: country.value,
    countryCode: countryCode.value,
    profilePhoto: profilePhoto.value,
    profileName: profileName.value,
    companyName: companyName.value,
    companyUrl: companyUrl.value,
    profileUrl: profileUrl.value + '/',
    headline: headline.value,
    location: location.value,
    cplocation: cplocation.value,
    moneyRaised: '',
    moneyRaisedUnits: '',
    companyLogo: companyLogo.value,
    experiences: experiences.value,
    skills: skills.value,
  });
  let endPoint = 'live_search/enrich/email';
  if (emailChecked.value && mobileChecked.value) {
    endPoint = 'live_search/enrich/all';
  } else if (mobileChecked.value) {
    endPoint = 'live_search/enrich/phone';
  } else if (emailChecked.value) {
    endPoint = 'live_search/enrich/email';
  }
  await updateToken();
  chrome.runtime.sendMessage({
    type: 'uploadSrappedPerson',
    dataToSave,
    endPoint,
    idex,
  });
};

const deepSearchItemContactInfo = async (idex: any, e: any) => {
  console.log("22222222222222222");
  salesNavEditItemIndex.value = idex;
  salesNavEditItem.value = e;
  if (
    salesNavEditItem.value.linkedinUrl === '' ||
    salesNavEditItem.value.linkedinUrl === undefined
  )
    await loadSalesProfile(0, salesNavEditItem.value['profile url'], appData);
  else await loadProfile(0, salesNavEditItem.value.linkedinUrl, appData);
  const dataToSave = await JSON.stringify({
    cpUrl: cpUrl.value,
    cpAbout: cpAbout.value,
    employeeCount: employeeCount.value,
    yearFounded: yearFounded.value,
    country: country.value,
    countryCode: countryCode.value,
    profilePhoto: profilePhoto.value,
    profileName: profileName.value,
    companyName: companyName.value,
    companyUrl: companyUrl.value,
    profileUrl: profileUrl.value + '/',
    headline: headline.value,
    location: location.value,
    cplocation: cplocation.value,
    moneyRaised: '',
    moneyRaisedUnits: '',
    companyLogo: companyLogo.value,
    experiences: experiences.value,
    skills: skills.value,
  });
  let endPoint = 'kompass_search/enrich/deep';
  let linkedInUrl = salesNavEditItem.value.linkedinUrl;
  await updateToken();
  chrome.runtime.sendMessage({
    type: 'deepSearchSrappedPerson',
    dataToSave,
    endPoint,
    idex,
    linkedInUrl
  });
  console.log("3333333333333333");

};

const openLinkedin = async () => {
  window.open(companyUrl.value, '_blank');
};

const openWebpage = async () => {
  window.open(cpUrl.value, '_blank');
};
const getSession = async () => {
  return new Promise(async function (resolve, reject) {
    if (!currentUser.value) {
      currentUser.value = userPool.value.getCurrentUser();
      if (!currentUser.value) {
        onLogout();
      }
    }
    currentUser.value.getSession(function (err: any, session: unknown) {
      if (err) {
        reject(err);
      } else {
        resolve(session);
      }
    });
  }).catch(err => {
    throw err;
  });
};

const onLogout = async () => {
  if (currentUser.value) currentUser.value.signOut();
  setDataToStorage({ accessToken: '', refreshToken: '', idToken: '' });
  loggedIn.value = '';
  appState.value = 'login';
};

const scrapingOn = async () => {
  console.log(scrapeCounts.value);
  status.value = 1;
  isLoading.value = true;
  scrapingStatus.value = '';
  appData.updateScrapingDone(false);
  salesData.value = false;
  setDataToStorage({ paused: 'false' });
  setDataToStorage({ scrapeCounts: scrapeCounts.value });
  setDataToStorage({ limitCounts: scrapingLimit.value });
  const dailyLimits = (await getDataFromStorage('dailyLimits')) || 0;
  setDataToStorage({ limitCountsStart: dailyLimits });
  scrappedData.value = [];
  console.log('After,', scrapeCounts.value);
  chrome.runtime.sendMessage({ type: 'saleNavScrapingStart' });
};
const resetData = async () => {
  emailAddress.value = [];
  phoneNumbers.value = [];
  scrappedData.value = [];
  salesNavSelectALL.value = false;
  appData.updateExperiences([]);
  appData.updateSkills([]);
  appData.updateSkills(null);
  profilePhoto.value = '';
  cpAbout.value = '';
  employeeCount.value = '';
  pUrl.value = '';
  cpAbout.value = '';
  industryContent.value = '';
  industryTags.value = '';
  employees.value = '';
  yearFounded.value = '';
  country.value = '';
  countryCode.value = '';
  profilePhoto.value = '';
  profileName.value = '';
  companyName.value = '';
  tagLine.value = '';
  companyUrl.value = '';
  profileUrl.value = '';
  headline.value = '';
  location.value = '';
  headquarte.value = '';
  moneyRaised.value = '';
  moneyRaisedUnits.value = '';
  employeeCountRange.value = '';
  cpUrl.value = '';
  location_1.value = '';
  companyLogo.value = '';
  specialities.value = [];
  cplocation.value = '';
};
// get list
const getListData = async () => {
  const list = await getList();
  // console.log('list ', list)
  if (list && list.data) {
    savedFolderList.value = list.data;
    const savedOption = await getDataFromStorage('savedOption');
    if (savedOption) {
      selectedListOption.value = savedOption;
    } else {
      if (savedFolderList.value.length)
        selectedListOption.value = savedFolderList.value[0]._id;
    }
  }
  // console.log('selectedListOption.value  ', selectedListOption.value)
};

// get list
const getFavouritesData = async (force: boolean) => {
  // console.log('Favorites Data');
  if (force) {
    // console.log('Force');
    const favorites = await getFavourites();
    // console.log('Favorites', favorites);
    if (favorites && favorites.data && favorites.data.length > 0) {
      setDataToStorage({ favourites: favorites.data });
      favoriteCompanyData.value = sortByProperty(
        favorites.data,
        'createdAt',
      ).slice(0, 10);
    }
    // console.log('get favoriteCompanyData', favoriteCompanyData);
  } else {
    let favorites: any = await getDataFromStorage('favourites');
    favorites = sortByProperty(favorites, 'createdAt').slice(0, 10);
    favoriteCompanyData.value = favorites;
    // console.log('storage favorites', favorites);
    // console.log('get storage favoriteCompanyData', favoriteCompanyData);
  }
};

function sortByProperty(array: any[], property: any) {
  return array.sort(function (a, b) {
    return b[property] - a[property];
  });
}
// load saved contacts
const loadContacts = async (force: boolean) => {
  const savedContacts = await getDataFromStorage('savedContacts');
  isLoading.value = true;
  if (savedContacts && !force) {
    contactsData.value = savedContacts;
  } else {
    const contacts = [];
    for (let index = 0; index < savedFolderList.value.length; index++) {
      const element = savedFolderList.value[index];
      const list = await contactLoadAPI(element._id);
      if (list && list.status) {
        contacts.push({ title: element.listTitle, list: list.data });
      }
    }
    contactsData.value = contacts;
    setDataToStorage({ savedContacts: contacts });
  }

  if (contactsData.value.length > 0) {
    if (selectedContactsTitle.value === 'All Contacts') {
      const tArr = [];
      for (let index = 0; index < contactsData.value.length; index++) {
        const element = contactsData.value[index];
        const arr = [...element.list];
        for (let jj = 0; jj < arr.length; jj++) {
          const el = arr[jj];
          const filters = tArr.filter(e => e.linkedin === el.linkedin);
          if (filters.length === 0) tArr.push(el);
        }
      }
      selectedContactsData.value = sortByProperty(tArr, 'createdAt');
    } else {
      for (let index = 0; index < contactsData.value.length; index++) {
        const element = contactsData.value[index];
        if (element.title === selectedContactsTitle.value) {
          selectedContactsData.value = element.list;
        }
      }
    }
    contactsTitleList.value = ['All Contacts'];

    if (savedFolderList.value.length > 0) {
      savedFolderList.value.forEach((contact: { listTitle: any }) => {
        contactsTitleList.value.push(contact.listTitle);
      });
    } else {
      for (let index = 0; index < contactsData.value.length; index++) {
        const element = contactsData.value[index];
        contactsTitleList.value.push(element.title);
      }
    }
    isLoading.value = false;
  }
  isLoading.value = false;
};
// create list
const createSaveList = async () => {
  if (createListName.value) {
    try {
      isLoading.value = true;
      const created = await createList(createListName.value);
      console.log(created);
      if (created && created.status) {
        await getListData();
        selectedListOption.value =
          savedFolderList.value[savedFolderList.value.length - 1]._id;

        if (multi.value) await multiContactSave();
        else await contactSave();
        isLoading.value = false;
        modalClose();
        return toast.success('Created successfully');
      } else {
        isLoading.value = false;
        if (created && created.message) {
          return toast.error(created.message);
        }
      }
    } catch (error) {}
    isLoading.value = false;
  } else {
    return toast.info('Please add the list name');
  }
};
const getContacts = async (e: any, type: any) => {
  const dataToSave = await JSON.stringify({ ...e });
  let endPoint = 'live_search/enrich/email';
  if (type === 'all') {
    endPoint = 'live_search/enrich/all';
  } else if (type === 'mobile') {
    endPoint = 'live_search/enrich/phone';
  } else if (type === 'email') {
    endPoint = 'live_search/enrich/email';
  }

  const personSaved = await uploadPerson(dataToSave);
  if (
    personSaved &&
    personSaved.status &&
    personSaved.data &&
    personSaved.data._id
  ) {
    const dt = await getRevealInfo(personSaved.data._id, endPoint);
    dt.enrichId = personSaved.data._id;
    return dt;
  }
};
const getContactsData = async (type: any) => {
  salesNavScrappedItems.value = [];
  isLoading.value = true;
  await updateToken();
  for (let index = 0; index < salesNavselectedItems.value.length; index++) {
    const element = salesNavselectedItems.value[index];
    try {
      const indProfile: any = await loadSaleNavProfile(
        element
          .replace('urn:li:fs_salesProfile:', '')
          .replace('(', '')
          .replace(')', '')
          .split(',')[0],
      );
      const dl: any = (await getDataFromStorage('dailyLimits')) || 0;
      setDataToStorage({ dailyLimits: dl + 2 });
      appData.updateLimits(dl + 2);
      if (!indProfile) continue;
      const el = await getContacts(indProfile, type);
      let phoneNumbers = [];
      let emailAddress = [];

      if (el && el.status) {
        // toast.success(dt.message)
        const data = el.data[0];
        if (data.validPhones) {
          phoneNumbers = data.validPhones.map((e: any) => e.phoneNumber);
        }
        if (data.validEmails && data.validEmails.personalEmails) {
          emailAddress = data.validEmails.personalEmails.map(
            (e: any) => e.email,
          );
        }
        if (data.validEmails && data.validEmails.riskyEmails) {
          emailAddress = [
            ...emailAddress,
            ...data.validEmails.riskyEmails.map((e: any) => e.email),
          ];
        }
        if (data.validEmails && data.validEmails.workEmails) {
          emailAddress = [
            ...emailAddress,
            ...data.validEmails.workEmails.map((e: any) => e.email),
          ];
        }
      } else {
        indProfile.error = true;
      }

      if (emailAddress.length > 0) {
        indProfile.emailAddress = emailAddress;
      }
      if (phoneNumbers.length > 0) {
        indProfile.phoneNumbers = phoneNumbers;
      }

      indProfile.enrichId = el.enrichId;
      // if (emailAddress.length > 0 || phoneNumbers.length > 0) {
      salesNavScrappedItems.value.push(indProfile);
    } catch (error) {}

    // }
  }
  isLoading.value = false;
};
const getSelectedItemsOnSales = () => {
  salesNavselectedItems.value = [];
  const checkboxes = document.querySelectorAll('.artdeco-list__item input');
  checkboxes.forEach(async function (checkbox) {
    //@ts-ignore
    const isChecked = checkbox.checked;
    if (isChecked) {
      const parentElement = checkbox.parentElement;
      const attributeValue = parentElement?.getAttribute(
        'data-scroll-into-view',
      );
      salesNavselectedItems.value.push(attributeValue);
    }
  });

  if (salesNavselectedItems.value.length === 0) {
    return toast.info('Please select items ');
  }
};

const handleAISearch = async () => {
  // if (searchText.value) {
  //   isLoading.value = true;
  //   const search = await searchAI(searchText.value);
  //   if (search && search.status) {
  //     searchedData.value = search.data;
  //   } else {
  //     return toast.error("Can't get data. Please try again later.");
  //   }
  // }
};

onMounted(async () => {
  resetData();
  console.log('Mounted');
  chrome.runtime.onMessage.addListener(async function (request: any) {
    if (request.action === 'checkingDetails') {
      resetData();
    } else if (request.action === 'gotRevealInfo') {
      isLoading.value = false;
      const dt = request.dt;
      if (dt && dt.status) {
        // toast.success(dt.message)
        const data = dt.data[0];
        if (mobileChecked.value) {
          if (data.validPhones) {
            phoneNumbers.value = data.validPhones.map(
              (e: any) => e.phoneNumber,
            );
          }
        }
        if (emailChecked.value) {
          if (data.validEmails && data.validEmails.personalEmails) {
            emailAddress.value = data.validEmails.personalEmails.map(
              (e: any) => e.email,
            );
          }
          if (data.validEmails && data.validEmails.riskyEmails) {
            emailAddress.value = [
              ...emailAddress.value,
              ...data.validEmails.riskyEmails.map((e: any) => e.email),
            ];
          }
          if (data.validEmails && data.validEmails.workEmails) {
            emailAddress.value = [
              ...emailAddress.value,
              ...data.validEmails.workEmails.map((e: any) => e.email),
            ];
          }
        }
        revealedName.value = profileName.value;
        setDataToStorage({ revealedName: revealedName });
        revealedOptions.value = {
          emailChecked: emailChecked.value,
          mobileChecked: mobileChecked.value,
        };
        if (
          emailAddress.value.length === 0 &&
          phoneNumbers.value.length === 0
        ) {
          return toast.info('contact not found ');
        }
      } else {
        return toast.error("Can't get data. Please try again later.");
      }
      const data = {
        contactInfo: contactInfo.value,
        companyData: companyData.value,
        skills: skills.value,
        experiences: experiences.value,
        salesData: salesData.value,
        emailAddress: emailAddress.value,
        phoneNumbers: phoneNumbers.value,
        profileName: profileName.value,
        headline: headline.value,
        profilePhoto: profilePhoto.value,
        profileUrl: profileUrl.value,
      };
      let historyData: any = await getDataFromStorage('history');
      if (!historyData) {
        historyData = [JSON.stringify(data)];
        setDataToStorage({ history: [JSON.stringify(data)] });
      } else if (historyData.length > 0) {
        let exist = false;
        for (let index = 0; index < historyData.length; index++) {
          const element = historyData[index];
          const el = JSON.parse(element);
          const id1 = getIdentity(el.profileUrl);
          const id2 = getIdentity(profileUrl.value);
          if (id1 === id2) {
            exist = true;
            historyData[index] = JSON.stringify(data);
          }
        }
        if (!exist) {
          historyData = [JSON.stringify(data), ...historyData];
          if (historyData.length >= 10) {
            historyData = historyData.slice(0, 10);
          }
        }
        setDataToStorage({ history: historyData });
      }
      setDataToStorage({ phoneNumbers: phoneNumbers });
      setDataToStorage({ emailAddress: emailAddress });
      const array = historyData.map((e: any) => {
        const history = JSON.parse(e);
        return {
          name: history.profileName,
          profilePhoto: history.profilePhoto,
          profileUrl: history.profileUrl,
          profileName: history.profileName,
          profile: history,
        };
      });
      searchHistory.value = array;
      searchedData.value = searchHistory.value;
    } else if (request.action === 'gotDataToSave') {
    } else if (request.action === 'gotSrappedRevealInfo') {
      const dt = request.dt;
      const idex = request.idex;

      if (dt && dt.status) {
        let phones = [],
          emails = [];
        const data = dt.data[0];
        if (data.validPhones) {
          phones = data.validPhones.map((e: any) => e.phoneNumber);
        }
        if (data.validEmails && data.validEmails.personalEmails) {
          emails = data.validEmails.personalEmails.map((e: any) => e.email);
        }
        if (data.validEmails && data.validEmails.riskyEmails) {
          emails = [
            ...emails,
            ...data.validEmails.riskyEmails.map((e: any) => e.email),
          ];
        }
        if (data.validEmails && data.validEmails.workEmails) {
          emails = [
            ...emails,
            ...data.validEmails.workEmails.map((e: any) => e.email),
          ];
        }
        scrappedData.value[idex].emails = emails.toString();
        scrappedData.value[idex].phones = phones.toString();
        scrappedData.value[idex].isEmailFound = emails.length > 0;
        scrappedData.value[idex].isPhoneFound = phones.length > 0;
        salesNavEditItem.value.emails = emails.toString();
        salesNavEditItem.value.phones = phones.toString();
        scrappedData.value[idex].revealed = true;
      } else {
        if (credits.value && dt && dt.message) {
          if (
            dt.message &&
            dt.message.includes(`You don't have enough credits to enrich.`)
          ) {
            credits.value = false;
            return toast.error("You don't have enough credits to enrich.");
          } else return toast.error("Can't get data. Please try again later.");
        }
      }
    } else if (request.action === 'gotSavedRevealInfo') {
      isLoading.value = false;
      const dt = request.dt;
      const endpoint = request.endpoint;
      const personSaved = request.personSaved;
      if (dt && dt.status) {
        const data = dt.data[0];
        if (
          data.isValidPhoneFound ||
          data.isPhoneFound ||
          data.isEmailFound ||
          data.isValidEmailFound
        ) {
          contactEle.value.updateEnrichData(
            data,
            savedFolderList.value,
            selectedListOption.value,
          );
          try {
            isLoading.value = true;
            const saved = await saveContact(
              contactClickedItem.value.contactTitle,
              personSaved.data._id,
            );
            if (saved && saved.status) {
              if (
                saved.message &&
                saved.message.includes('0 Contacts are saved')
              ) {
                toast.error('Failed, try again later');
              } else if (
                saved.message &&
                saved.message.includes('1 Contacts are saved')
              ) {
                toast.success(saved.message);
                loadContacts(true);
              }
              var modal = document.getElementById('staticReveal');
              //@ts-ignore
              modal.classList.remove('show');
              //@ts-ignore
              modal.style.display = 'none';
              document.body.classList.remove('modal-open');
            } else if (saved.message) {
              toast.error(saved.message);
            }
          } catch (error) {}
          isLoading.value = false;
        }
      } else {
        return toast.error("Can't get data. Please try again later.");
      }
    } else if (request.action === 'gotHistoryRevealInfo') {
      isLoading.value = false;
      const dt = request.dt;
      if (dt && dt.status) {
        const data = dt.data[0];
        HistoryEle.value.updateEnrichData(
          data,
          savedFolderList.value,
          selectedListOption.value,
        );
        if (data.validPhones) {
          historyPhoneNumbers.value = data.validPhones.map(
            (e: any) => e.phoneNumber,
          );
        }
        if (data.validEmails && data.validEmails.personalEmails) {
          historyEmailAddress.value = data.validEmails.personalEmails.map(
            (e: any) => e.email,
          );
        }
        if (data.validEmails && data.validEmails.riskyEmails) {
          historyEmailAddress.value = [
            ...historyEmailAddress.value,
            ...data.validEmails.riskyEmails.map((e: any) => e.email),
          ];
        }
        if (data.validEmails && data.validEmails.workEmails) {
          historyEmailAddress.value = [
            ...historyEmailAddress.value,
            ...data.validEmails.workEmails.map((e: any) => e.email),
          ];
        }
        updateHistoryClickedItem();
      } else {
        return toast.error("Can't get data. Please try again later.");
      }
    } else {
      page_type.value = pageType(window.location.href);
    }
    // console.log('app got message', request)
  });

  // console.log('pop mounted', loggedIn.value)
  isSales.value = window.location.href.includes('sales/lead');
  loggedIn.value = await getDataFromStorage('idToken');
  page_type.value = pageType(window.location.href);
  const userPoolId = 'us-east-1_U94Z3C3bH';
  const clientId = '7l48iqc7obdo3ctgkalc7fjq60';
  const poolData = {
    UserPoolId: `${userPoolId}`,
    ClientId: `${clientId}`,
  };
  userPool.value = new CognitoUserPool(poolData);
  currentUser.value = userPool.value.getCurrentUser();
  if (loggedIn.value) {
    await updateToken();
    appState.value = 'loggedIn';
    getListData();
    const favourites = await getDataFromStorage('favourites');
    if (favourites && favourites.length > 0) getFavouritesData(false);
    else getFavouritesData(true);
  }
  let historyData: any = await getDataFromStorage('history');
  if (historyData && historyData.length > 0) {
    searchHistory.value = historyData.map((e: any) => {
      const history = JSON.parse(e);
      return {
        name: history.profileName,
        profilePhoto: history.profilePhoto,
        profileUrl: history.profileUrl,
        profileName: history.profileName,
        headline: history.headline,
        profile: history,
      };
    });
    searchedData.value = searchHistory.value;
  }
});
const searchingHistory = async (ef: any) => {
  if (ef) {
    let historyData: any = await getDataFromStorage('history');
    if (historyData && historyData.length > 0) {
      const filtered = historyData.filter((e: any) => {
        const history = JSON.parse(e);
        if (history.profileName.toLowerCase().includes(ef.toLowerCase())) {
          return true;
        }
      });
      searchedData.value = filtered.map((e: any) => {
        const history = JSON.parse(e);
        return {
          name: history.profileName,
          profilePhoto: history.profilePhoto,
          profileUrl: history.profileUrl,
          profileName: history.profileName,
          headline: history.headline,
          profile: history,
        };
      });
    }
  }
};
// when you click the tabs -
const tabSelect = (e: number) => {
  console.log(' tabSelect ', e);
  if (selectedTab.value === 1 && e == 1) {
    contactClickedItem.value = null;
    companyClickedItem.value = null;
  } else if (e == 1) {
    loadContacts(false);
  }

  if (selectedTab.value === 2 && e == 2) {
    historyClickedItem.value = null;
  }
  selectedTab.value = e;
  setDataToStorage({ selectedTab: selectedTab });
};
const backButtonClick = () => {
  chrome.storage.local.set({ kps_sticky: 'show' });
  const el = document.getElementById('kps_sticky') as HTMLElement;
  el.style.display = 'flex';
  appData.updateCEVisible(false);
};
const contactInfoUpdated = async (e: any) => {};
const gotoLogin = async () => {
  appState.value = 'login';
};
const gotoRegister = async () => {
  window.open('https://kompassai.com/signup', '_blank');
};
const joinUs = async () => {
  window.open('https://www.linkedin.com/company/kompassai1/about/', '_blank');
};
const visitKompassAI = async () => {
  window.open('https://master.d10jy9fkx07opc.amplifyapp.com/', '_blank');
};
const listsInKompassAI = async () => {
  window.open('https://www.kompassai.com/list', '_blank');
};
const gotoIntegration = async () => {
  window.open('https://www.kompassai.com/intergrate', '_blank');
};
const gotoPrivacy = async () => {
  window.open(
    'https://netorgft14255511-my.sharepoint.com/:w:/g/personal/imogen_kompassai_com/EVzrK_3cpNRJqgNTu54I-E8BZ8B8LdFlwloxxcHEJ9xE_A?e=IksfPT',
    '_blank',
  );
};
const gotoHelpCenter = async () => {
  window.open('https://www.kompassai.com/FAQ', '_blank');
};
const updateHistoryClickedItem = async () => {
  if (historyClickedItem.value) {
    historyClickedItem.value.profile.phoneNumbers = [
      ...historyPhoneNumbers.value,
      ...historyClickedItem.value.profile.phoneNumbers,
    ];
    historyClickedItem.value.profile.emailAddress = [
      ...historyEmailAddress.value,
      ...historyClickedItem.value.profile.emailAddress,
    ];

    let historyData: any = await getDataFromStorage('history');
    for (let index = 0; index < historyData.length; index++) {
      const element = historyData[index];
      const el = JSON.parse(element);
      const id1 = getIdentity(el.profileUrl);
      const id2 = getIdentity(historyClickedItem.value.profileUrl);
      if (id1 === id2) {
        historyData[index] = JSON.stringify(historyClickedItem.value.profile);
      }
    }
    setDataToStorage({ history: historyData });
  }
};

const multiContactSave = async () => {
  let cnt = 0;
  if (savedFolderList.value.length === 0) {
    return toast.info('Please create the new list');
  }
  if (!selectedListOption.value) {
    return toast.info('Please create the new list');
  }
  const filtered = savedFolderList.value.filter(
    (f: any) => f._id === selectedListOption.value,
  );
  if (salesNavScrappedItems.value.length > 0) {
    for (const item of salesNavScrappedItems.value) {
      isSales.value = true;
      salesNavEditItem.value = item;
      await new Promise(resolve => {
        contactSave().then(() => resolve(null));
      });
      cnt++;
    }
    isLoading.value = false;
    loadContacts(true);
    toast.success(`${cnt} Contacts are saved to ${filtered[0].listTitle}`);
    return;
  }
  for (const item of scrappedData.value) {
    if (item.checked && (item.emails || item.phones)) {
      isSales.value = true;
      salesNavEditItem.value = item;
      await new Promise(resolve => {
        contactSave().then(() => resolve(null));
      });
      cnt++;
    }
  }

  isLoading.value = false;
  loadContacts(true);
  toast.success(`${cnt} Contacts are saved to ${filtered[0].listTitle}`);
};
const contactListSave = async () => {
  isSaleNavList.value = false;
  isLoading.value = true;

  try {
    await updateToken();
    if (savedFolderList.value.length === 0) {
      return toast.info('Please create the new list');
    }
    if (!selectedListOption.value) {
      return toast.info('Please create the new list');
    }
    const filtered = savedFolderList.value.filter(
      (f: any) => f._id === selectedListOption.value,
    );

    const items = salesNavScrappedItems.value.map((e: any) => e.enrichId);
    console.log('items', items);

    const saved = await saveMultiContact(filtered[0].listTitle, items);
    console.log('contactListSave', saved);
    if (saved.message) {
      toast.success(saved.message);
    }
  } catch (error) {}
  isLoading.value = false;
  const modal = document.getElementById('staticReveal');
  if (modal) {
    //@ts-ignore
    modal.classList.remove('show');
    //@ts-ignore
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
};

const contactSave = async () => {
  if (isSaleNavList.value) {
    contactListSave();
    return;
  }
  isLoading.value = true;
  if (savedFolderList.value.length === 0) {
    return toast.info('Please create the new list');
  }
  if (!selectedListOption.value) {
    return toast.info('Please create the new list');
  }
  const filtered = savedFolderList.value.filter(
    (f: any) => f._id === selectedListOption.value,
  );
  let raw;
  console.log('99 contactSave ', salesNavEditItem.value);

  if (salesNavEditItem.value.enrichId) {
  } else if (isSales.value) {
    await loadProfile(0, salesNavEditItem.value.linkedinUrl, appData);
    raw = await JSON.stringify({
      cpUrl: cpUrl.value,
      cpAbout: cpAbout.value,
      employeeCount: employeeCount.value,
      yearFounded: yearFounded.value,
      country: country.value,
      countryCode: countryCode.value,
      profilePhoto: profilePhoto.value,
      profileName: profileName.value,
      companyName: companyName.value,
      companyUrl: companyUrl.value,
      profileUrl: profileUrl.value + '/',
      headline: headline.value,
      location: location.value,
      cplocation: cplocation.value,
      moneyRaised: salesNavEditItem.value.moneyRaised,
      moneyRaisedUnits: salesNavEditItem.value.moneyRaisedUnits,
      companyLogo: companyLogo.value,
      experiences: experiences.value,
      skills: skills.value,
    });
  } else {
    if (selectedTab.value === 0) {
      raw = JSON.stringify({
        cpUrl: cpUrl.value,
        cpAbout: cpAbout.value,
        employeeCount: employeeCount.value,
        yearFounded: yearFounded.value,
        country: country.value,
        countryCode: countryCode.value,
        profilePhoto: profilePhoto.value,
        profileName: profileName.value,
        companyName: companyName.value,
        companyUrl: companyUrl.value,
        profileUrl: profileUrl.value,
        headline: headline.value,
        location: location.value,
        cplocation: cplocation.value,
        moneyRaised: moneyRaised.value,
        moneyRaisedUnits: moneyRaisedUnits.value,
        companyLogo: companyLogo.value,
        experiences: experiences.value,
        skills: skills.value,
      });
    } else if (selectedTab.value === 2) {
      let profile = historyClickedItem.value.profile;
      raw = JSON.stringify({
        cpUrl: profile.companyData.cpUrl,
        cpAbout: profile.companyData.cpAbout,
        employeeCount: profile.companyData.employeeCount,
        yearFounded: profile.companyData.yearFounded,
        country: profile.companyData.country,
        countryCode: profile.companyData.countryCode,
        profilePhoto: profile.companyData.profilePhoto,
        profileName: profile.companyData.profileName,
        companyName: profile.companyData.companyName,
        companyUrl: profile.companyData.companyUrl,
        profileUrl: profile.companyData.profileUrl,
        headline: profile.headline,
        location: profile.companyData.location,
        cplocation: profile.companyData.cplocation,
        moneyRaised: profile.companyData.moneyRaised,
        moneyRaisedUnits: profile.companyData.moneyRaisedUnits,
        companyLogo: profile.companyData.companyLogo,
        experiences: profile.experiences,
        skills: profile.skills,
      });
    }
  }
  try {
    await updateToken();
    let personSavedId;
    if (salesNavEditItem.value.enrichId) {
      personSavedId = salesNavEditItem.value.enrichId;
    } else {
      const personSaved = await uploadPerson(raw);
      if (
        personSaved &&
        personSaved.status &&
        personSaved.data &&
        personSaved.data._id
      ) {
        personSavedId = personSaved.data._id;
      } else {
        return toast.error("Can't save. Please try again later.");
      }
    }

    const saved = await saveContact(filtered[0].listTitle, personSavedId);
    if (saved && saved.status) {
      if (saved.message && saved.message.includes('0 Contacts are saved')) {
        toast.error('Failed, try again later');
      } else if (
        saved.message &&
        saved.message.includes('1 Contacts are saved')
      ) {
        if (!multi.value) {
          toast.success(saved.message);
          loadContacts(true);
        }
      }
      var modal = document.getElementById('staticReveal');
      //@ts-ignore
      modal.classList.remove('show');
      //@ts-ignore
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    } else if (saved.message) {
      toast.error(saved.message);
    }
  } catch (error) {}
  isLoading.value = false;
};
const openPage = async (url: string) => {
  const httpinclude = url.includes('https://') || url.includes('http://');
  if (!httpinclude) {
    return window.open('https://' + url, '_blank');
  }
  window.open(url, '_blank');
};
// history item click event
const historyClicked = async (e: any) => {
  console.log('historyClicked', e);
  if (
    historyClickedItem.value &&
    historyClickedItem.value.profileUrl === e.profileUrl
  ) {
    historyClickedItem.value = null;
  } else {
    historyClickedItem.value = e;
  }
};
// contact item click event
const contactClicked = async (e: any) => {
  if (
    contactClickedItem.value &&
    contactClickedItem.value.profileUrl === e.profileUrl
  ) {
    contactClickedItem.value = null;
  } else {
    contactClickedItem.value = e;
  }
  console.log('Clicked Contact Item : ', contactClickedItem);
};
// contact item click event
const companyClicked = async (e: any) => {
  if (
    companyClickedItem.value &&
    companyClickedItem.value.profileUrl === e.profileUrl
  ) {
    companyClickedItem.value = null;
  } else {
    companyClickedItem.value = e;
  }
};
const scrapingResult = async (ff: any) => {
  // result
  const dailyLimits: any = await getDataFromStorage('dailyLimits');
  if (dailyLimits) limits.value = 800 - dailyLimits > 0 ? 800 - dailyLimits : 0;
  const dataItems: any = [];
  if (ff && ff.length > 0) {
    ff.forEach((e: any) => {
      try {
        const companyID =
          e.currentPositions.length > 0 ? e.currentPositions[0].companyUrn : '';
        let photoUrl = '';
        try {
          photoUrl =
            e.profilePictureDisplayImage.rootUrl +
            e.profilePictureDisplayImage.artifacts[1]
              .fileIdentifyingUrlPathSegment;
        } catch (error) {}
        const cid = companyID
          ? companyID.replace('urn:li:fs_salesCompany:', '')
          : '';
        dataItems.push({
          'Full Name': e.fullName,
          'First Name': e.firstName,
          'Last Name': e.lastName,
          'profile url':
            'https://www.linkedin.com/sales/lead/' +
            e.entityUrn
              .replace('urn:li:fs_salesProfile:', '')
              .replace('(', '')
              .replace(')', ''),
          'Company Name':
            e.currentPositions.length > 0
              ? e.currentPositions[0].companyName
              : '',
          'Company URL': cid ? 'https://linkedin.com/company/' + cid : '',
          'Job Title':
            e.currentPositions.length > 0 ? e.currentPositions[0].title : '',
          Location: e.geoRegion,
          'Company ID': cid,
          degree: e.degree,
          cpUrl: e.cpUrl,
          headline: e.headline,
          cpAbout: e.cpAbout,
          revealed: false,
          moneyRaised: e.moneyRaised,
          moneyRaisedUnits: e.moneyRaisedUnits,
          linkedinUrl: e.linkedinUrl,
          'Profile Photo': photoUrl,
          Summary: e.summary,
          checked: false,
          entityUrn: e.entityUrn,
        });
      } catch (error) {
        //
      }
    });
  } else {
    return;
  }
  scrappedData.value.push(...dataItems);
  await await saveSalesNav(dataItems);
  // console.log(scrappedData.value);
};
const scrapingDoneResult = async (ff: any) => {
  if (ff) {
    isLoading.value = false;
  }
};
const scrapinglimits = async (ff: any) => {
  const dailyLimits: any = await getDataFromStorage('dailyLimits');
  if (dailyLimits) limits.value = 800 - dailyLimits > 0 ? 800 - dailyLimits : 0;
};

const backToSave = async () => {
  var modal = document.getElementById('createNewList');
  //@ts-ignore
  modal.classList.remove('show');
  //@ts-ignore
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
  saveContactInfo();
};

const backToRefresh = async () => {
  scrappedData.value = [];
  console.log('backToRefresh', scrappedData.value, scrapeCounts.value);
};

const modalClose = async () => {
  var modal = document.getElementById('createNewList');
  //@ts-ignore
  modal.classList.remove('show');
  //@ts-ignore
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
};

const createNewList = async () => {
  // staticRevealRef.value.show();
  var modal = document.getElementById('createNewList');
  modal?.classList.add('show');
  //@ts-ignore
  modal.style.display = 'block';
  document.body.classList.add('modal-open');
  var closeModalButtons = document.querySelectorAll(
    '[data-bs-dismiss="modal"]',
  );
  closeModalButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var modal = document.getElementById('staticReveal');
      //@ts-ignore
      modal.classList.remove('show');
      //@ts-ignore
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    });
  });
};
function getCognitoUser(email: any) {
  const userData = {
    Username: email,
    Pool: userPool.value,
  };
  const cognitoUser = new CognitoUser(userData);
  return cognitoUser;
}

async function signInWithEmail(email: any, password: any) {
  return new Promise(function (resolve, reject) {
    const authenticationData = {
      Username: email,
      Password: password,
      ValidationData: {
        captcha: '-1',
      },
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    currentUser.value = getCognitoUser(email);
    console.log('current User', currentUser.value);
    currentUser.value.authenticateUser(authenticationDetails, {
      onSuccess: function (res: any) {
        resolve(res);
      },
      onFailure: function (err: any) {
        reject(err);
      },
    });
  }).catch(err => {
    throw err;
  });
}
const login = async (email: any, password: any) => {
  const justInstalled: any = await getDataFromStorage('installed');
  isLoading.value = true;
  userEmail.value = email;
  userPassword.value = password;
  try {
    const resp: any = await signInWithEmail(
      userEmail.value,
      userPassword.value,
    );
    setDataToStorage({
      accessToken: resp.accessToken.jwtToken,
      refreshToken: resp.refreshToken.token,
      idToken: resp.idToken.jwtToken,
      email: userEmail.value,
    });
    if (justInstalled) {
      await sendInstallRequest();
      await setDataToStorage({ installed: false });
    }
    await getListData();
    const favourites = await getDataFromStorage('favourites');
    if (favourites && favourites.length > 0) getFavouritesData(false);
    else getFavouritesData(true);
    appState.value = 'loggedIn';
  } catch (error: any) {
    console.log(88, error.message);
    if (error.message.includes("User doesn't exist.")) {
      toast.error("User doesn't exist.");
    } else {
      toast.error(error.message);
    }
  }
  // setDataToStorage({ 'token': 'iamtoken' })
  isLoading.value = false;
  // appState.value = 'loggedIn'
};

const revealContactInfo = async () => {
  if (emailAddress.value.length > 0 && !mobileChecked.value) {
    toast.info('Please select phone');
    return;
  }
  if (phoneNumbers.value.length > 0 && !emailChecked.value) {
    toast.info('Please select email ');
    return;
  }
  if (!emailChecked.value && !mobileChecked.value) {
    toast.info('Please select email or phone');
    return;
  }
  const dataToSave = JSON.stringify({
    cpUrl: cpUrl.value,
    cpAbout: cpAbout.value,
    employeeCount: employeeCount.value,
    yearFounded: yearFounded.value,
    country: country.value,
    countryCode: countryCode.value,
    profilePhoto: profilePhoto.value,
    profileName: profileName.value,
    companyName: companyName.value,
    companyUrl: companyUrl.value,
    profileUrl: profileUrl.value,
    headline: headline.value,
    location: location.value,
    cplocation: cplocation.value,
    moneyRaised: moneyRaised.value,
    moneyRaisedUnits: moneyRaisedUnits.value,
    companyLogo: companyLogo.value,
    experiences: experiences.value,
    skills: skills.value,
  });
  let endPoint = 'live_search/enrich/email';
  if (emailChecked.value && mobileChecked.value) {
    emailAddress.value = [];
    phoneNumbers.value = [];
    endPoint = 'live_search/enrich/all';
  } else if (mobileChecked.value) {
    phoneNumbers.value = [];
    endPoint = 'live_search/enrich/phone';
  } else if (emailChecked.value) {
    emailAddress.value = [];
  }
  isLoading.value = true;
  await updateToken();
  chrome.runtime.sendMessage({ type: 'uploadPerson', dataToSave, endPoint });
};

const saveSalesContactInfo = async (isMulti: any, idex: any, e: any) => {
  if (scrapeSelectedItemsCount.value === 0)
    return toast.error('Please select an enriched contact.');
  else {
    if (isMulti) {
      multi.value = true;
    } else {
      multi.value = false;
      salesNavEditItem.value = e;
      salesNavEditItemIndex.value = idex;
    }
    isSales.value = true;
    var modal = document.getElementById('staticReveal');
    modal?.classList.add('show');
    //@ts-ignore
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    var closeModalButtons = document.querySelectorAll(
      '[data-bs-dismiss="modal"]',
    );
    closeModalButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var modal = document.getElementById('staticReveal');
        //@ts-ignore
        modal.classList.remove('show');
        //@ts-ignore
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
      });
    });
  }
};
const addToListFunc = async () => {
  isSales.value = true;
  isSaleNavList.value = true;

  var modal = document.getElementById('staticReveal');
  modal?.classList.add('show');
  //@ts-ignore
  modal.style.display = 'block';
  document.body.classList.add('modal-open');
  var closeModalButtons = document.querySelectorAll(
    '[data-bs-dismiss="modal"]',
  );
  closeModalButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var modal = document.getElementById('staticReveal');
      //@ts-ignore
      modal.classList.remove('show');
      //@ts-ignore
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    });
  });
};
const saveContactInfo = async () => {
  console.log('saveContactInfo');
  var modal = document.getElementById('staticReveal');
  modal?.classList.add('show');
  //@ts-ignore
  modal.style.display = 'block';
  document.body.classList.add('modal-open');
  var closeModalButtons = document.querySelectorAll(
    '[data-bs-dismiss="modal"]',
  );
  closeModalButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var modal = document.getElementById('staticReveal');
      //@ts-ignore
      modal.classList.remove('show');
      //@ts-ignore
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    });
  });
};
const companyDataUpdated = async (e: any) => {
  if (!e.value) return;
  if (e.value.profilePhoto) profilePhoto.value = e.value.profilePhoto;
  if (e.value.cpAbout) cpAbout.value = e.value.cpAbout;
  if (e.value.employeeCount) employeeCount.value = e.value.employeeCount;
  if (e.value.pUrl) pUrl.value = e.value.pUrl;
  if (e.value.cpAbout) cpAbout.value = e.value.cpAbout;
  if (e.value.industryContent) industryContent.value = e.value.industryContent;
  if (e.value.industryTags) industryTags.value = e.value.industryTags;
  if (e.value.employees) employees.value = e.value.employees;
  if (e.value.yearFounded) yearFounded.value = e.value.yearFounded;
  if (e.value.country) country.value = e.value.country;
  if (e.value.countryCode) countryCode.value = e.value.countryCode;
  if (e.value.profilePhoto) profilePhoto.value = e.value.profilePhoto;
  if (e.value.profileName) profileName.value = e.value.profileName;
  if (e.value.companyName) companyName.value = e.value.companyName;
  if (e.value.tagLine) tagLine.value = e.value.tagLine;
  if (e.value.companyUrl) companyUrl.value = e.value.companyUrl;
  if (e.value.profileUrl) profileUrl.value = e.value.profileUrl;
  if (e.value.headline) headline.value = e.value.headline;
  if (e.value.location) location.value = e.value.location;
  if (e.value.headquarter) headquarte.value = e.value.headquarter;
  if (e.value.moneyRaised) moneyRaised.value = e.value.moneyRaised;
  if (e.value.moneyRaisedUnits)
    moneyRaisedUnits.value = e.value.moneyRaisedUnits;
  if (e.value.employeeCountRange)
    employeeCountRange.value = e.value.employeeCountRange;
  if (e.value.cpUrl) {
    cpUrl.value = e.value.cpUrl;
    try {
      if (e.value.headquarter?.address?.city)
        location_1.value = e.value.headquarter?.address?.city || '';
    } catch (error) {}
  }
  if (e.value.companyLogo) companyLogo.value = e.value.companyLogo;
  if (e.value.specialities) specialities.value = e.value.specialities || [];
  if (e.value.cplocation) cplocation.value = e.value.cplocation || '';

  let historyData: any = await getDataFromStorage('history');
  if (historyData && historyData.length > 0) {
    searchHistory.value = historyData.map((e: any) => {
      const history = JSON.parse(e);
      return {
        name: history.profileName,
        profilePhoto: history.profilePhoto,
        profileUrl: history.profileUrl,
        profileName: history.profileName,
        headline: history.headline,
        profile: history,
      };
    });
    searchedData.value = searchHistory.value;
    for (let index = 0; index < historyData.length; index++) {
      const element = historyData[index];
      const el = JSON.parse(element);
      const id1 = getIdentity(el.profileUrl);
      const id2 = getIdentity(profileUrl.value);
      if (id1 === id2) {
        emailAddress.value = el.emailAddress;
        phoneNumbers.value = el.phoneNumbers;
        break;
      }
    }
  }
};

const selectedListOptionChange = (e: any) => {
  if (e) {
    setDataToStorage({ savedOption: e });
  }
};
const selectedContactsTitleChange = async (e: any) => {
  if (selectedContactsTitle.value === 'All Contacts') {
    const tArr: any[] = [];
    for (let index = 0; index < contactsData.value.length; index++) {
      const element = contactsData.value[index];
      const arr = [...element.list];
      for (let jj = 0; jj < arr.length; jj++) {
        const el = arr[jj];
        el.contactTitle = element.title;
        const ind = tArr.findIndex(e => e.linkedin === el.linkedin);
        if (ind === -1) {
          // If no matching object is found, push the 'el' object to 'tArr'
          tArr.push(el);
        } else {
          // If a matching object is found, merge the properties of 'el' into the existing object
          tArr[ind] = { ...tArr[ind], ...el };
        }
      }
    }
    // selectedContactsData.value = await sortByProperty(tArr, 'createdAt');
    selectedContactsData.value = tArr;
  } else {
    for (let index = 0; index < contactsData.value.length; index++) {
      const element = contactsData.value[index];
      if (element.title === selectedContactsTitle.value) {
        for (let ind = 0; ind < element.list.length; ind++)
          element.list[ind].contactTitle = element.title;
        selectedContactsData.value = element.list;
      }
    }
  }
  contactSearchFilterText.value = '';
  contactSearchedData.value = selectedContactsData.value;
};
const searchingContacts = async (ef: any) => {
  if (ef) {
    if (selectedContactsData.value.length > 0) {
      const filtered = selectedContactsData.value.filter((e: any) => {
        if (e.name.toLowerCase().includes(ef.toLowerCase())) {
          return true;
        }
      });
      contactSearchedData.value = filtered;
    }
  } else {
    contactSearchedData.value = selectedContactsData.value;
  }
};

const totalUpdate = async (ef: any) => {
  totalItems.value = ef;
  scrapeCounts.value =
    totalItems.value > 800
      ? totalItems.value > limits.value
        ? limits.value
        : totalItems.value
      : totalItems.value;
};
const scrapeCountsUpdate = async (ef: any) => {
  ef = Number(ef);
  scrapeCounts.value = ef;
  scrapeCounts.value =
    25 * Math.ceil(scrapeCounts.value / 25) < 800
      ? 25 * Math.ceil(scrapeCounts.value / 25)
      : 800;
};

const searchingCompanies = async (ef: any) => {
  if (ef) {
    if (favoriteCompanyData.value.length > 0) {
      const filtered = favoriteCompanyData.value.filter((e: any) => {
        // console.log('searchingCompanies ', e);
        if (e.companyName.toLowerCase().includes(ef.toLowerCase())) {
          return true;
        }
      });
      companySearchedData.value = filtered;
    }
  } else {
    companySearchedData.value = favoriteCompanyData.value;
  }
};

const saveCompany = async (e: any) => {
  console.log('Save Company', e);
  let companyNumber = 0;
  try {
    const filtered = favoriteCompanyData.value.filter((ef: any) => {
      if (
        e.subtitle.toLowerCase().includes(ef.companyName.toLowerCase().trim())
      ) {
        return true;
      }
      if (e.title.toLowerCase().includes(ef.companyName.toLowerCase().trim())) {
        return true;
      }
    });
    console.log(55, filtered.length);
    if (filtered.length !== 0) {
      return toast.info('already exist in the list');
    }
    if (e.companyUrn) {
      if (e.companyUrn.includes('urn:li:fsd_company:'))
        companyNumber = e.companyUrn.replace('urn:li:fsd_company:', '');
      if (e.companyUrn.includes('urn:li:fs_salesCompany:'))
        companyNumber = e.companyUrn.replace('urn:li:fs_salesCompany:', '');
    } else return toast.info("Can't add. Company is not valid");

    if (companyNumber) {
      // console.log(companyNumber);
      isLoading.value = true;
      try {
        const dt: any = await loadCompanyData(companyNumber);
        // console.log(dt);

        let emCounts = '-';
        if (employeeCountRange.value.start) {
          emCounts =
            employeeCountRange.value.start +
            ' - ' +
            employeeCountRange.value.end;
        }
        const timestamp = new Date().getTime();
        const timestampInSeconds = Math.floor(timestamp / 1000);
        const raw = {
          website: dt.cpUrl,
          about: dt.cpAbout,
          headCount: emCounts,
          yearFounded: dt.yearFounded,
          name: dt.companyName,
          linkedin: dt.companyUrl,
          location: dt.cplocation,
          logo: dt.companyLogo,
          revenu: dt.moneyRaised,
          numberOfContacts: dt.employeeCount,
          phoneNumber: [],
          createdAt: timestampInSeconds,
        };
        const filtered = favoriteCompanyData.value.filter((e: any) => {
          if (
            e.companyName.toLowerCase().trim() == raw.name.toLowerCase().trim()
          ) {
            return true;
          }
        });
        if (filtered.length === 0) {
          const dt = await saveFavourite(JSON.stringify({ input: raw }));
          // console.log(dt);
          isLoading.value = false;

          if (dt && dt.data && dt.data.id) {
            getFavouritesData(true);
            return toast.success('added');
          }
        } else {
          return toast.info('already exist in the list');
        }
      } catch (error) {}
      isLoading.value = false;
    } else {
      return toast.info("Can't add. the company data is not available");
    }
  } catch (error) {}
};

const saveCompanyData = async () => {
  // console.log('saveCompanyData');
  const timestamp = new Date().getTime();
  const timestampInSeconds = Math.floor(timestamp / 1000);
  let emCounts = '-';
  if (employeeCountRange.value.start) {
    emCounts =
      employeeCountRange.value.start + ' - ' + employeeCountRange.value.end;
  }
  if (cpUrl.value === '') cpUrl.value = companyUrl.value;
  const raw = {
    website: cpUrl.value,
    about: cpAbout.value,
    headCount: emCounts,
    yearFounded: yearFounded.value,
    name: companyName.value,
    linkedin: companyUrl.value,
    location: cplocation.value,
    logo: companyLogo.value,
    revenu: moneyRaised.value,
    numberOfContacts: employeeCount.value,
    phoneNumber: [],
    createdAt: timestampInSeconds,
  };
  // console.log(raw);
  const filtered = favoriteCompanyData.value.filter((e: any) => {
    if (e.companyName.toLowerCase().trim() == raw.name.toLowerCase().trim()) {
      return true;
    }
  });
  console.log(filtered.length);
  if (filtered.length === 0) {
    isLoading.value = true;
    try {
      const dt = await saveFavourite(JSON.stringify({ input: raw }));
      if (dt && dt.data && dt.data.id) {
        isLoading.value = false;
        getFavouritesData(true);
        return toast.success('added');
      }
    } catch (error) {}
    isLoading.value = false;
  } else {
    return toast.info('already exist in the list');
  }
};
const commandChanges = async (ef: any) => {
  const command = await getDataFromStorage('kps_commands');
  // console.log({ command })
  if (command === 'kps_find_all') {
    emailChecked.value = true;
    mobileChecked.value = true;
    revealContactInfo();
  } else if (command === 'kps_find_email') {
    emailChecked.value = true;
    mobileChecked.value = false;
    revealContactInfo();
  } else if (command === 'kps_find_phone') {
    emailChecked.value = false;
    mobileChecked.value = true;
    revealContactInfo();
  } else if (command === 'kps_view_contact') {
    try {
      const tabs = document.querySelectorAll('.kps-content-view .tab-pane');
      console.log(tabs);
      tabs.forEach(ff => {
        console.log(ff);
        ff.classList.remove('active');
        console.log(ff.id);
        if (ff.id === 'nav-save-contacts') {
          ff.classList.add('active');
          ff.classList.add('show');
        }
      });
    } catch (error) {}
    const tabs = document.querySelectorAll(
      '.kps-content-view .nav-tabs button',
    );
    console.log(tabs);
    tabs.forEach((ff: any) => {
      console.log(ff);
      ff.classList.remove('active');
      console.log(ff.id);
      if (ff.id === 'nav-save-contacts-tab') {
        ff.classList.add('active');
        ff.click();
      }
    });
  }
  chrome.storage.local.set({ kps_commands: '' });
};

const btnAddedChanges = async (ef: any) => {
  console.log('btnAddedChanges  added   ');
  const page = pageType(window.location.href);
  console.log('checkingDetails ====== ', page);

  if (page === SALES_NAV_SEARCH_PATTERN) {
    const selectorProfile = '[class*="sticky-nav"] .p4';
    await waitElement(selectorProfile);
    const findEmail = document.getElementById('kps_sales_find_email');
    if (!findEmail?.classList.contains('kps-func')) {
      findEmail?.classList.add('kps-func');
      findEmail?.addEventListener('click', async function () {
        appData.updateCEVisible(true);
        getSelectedItemsOnSales();
        if (salesNavselectedItems.value.length > 0) {
          await getContactsData('email');
        }
      });
    }
    const findPhone = document.getElementById('kps_sales_find_phone');
    if (!findPhone?.classList.contains('kps-func')) {
      findPhone?.classList.add('kps-func');
      findPhone?.addEventListener('click', async function () {
        appData.updateCEVisible(true);
        getSelectedItemsOnSales();
        if (salesNavselectedItems.value.length > 0) {
          await getContactsData('mobile');
        }
      });
    }
    const findBoth = document.getElementById('kps_sales_find_all');
    if (!findBoth?.classList.contains('kps-func')) {
      findBoth?.classList.add('kps-func');
      findBoth?.addEventListener('click', async function () {
        appData.updateCEVisible(true);
        getSelectedItemsOnSales();
        if (salesNavselectedItems.value.length > 0) {
          await getContactsData('all');
        }
      });
    }
    const salesSave = document.getElementById('kps_sales_save');
    if (!salesSave?.classList.contains('kps-func')) {
      salesSave?.classList.add('kps-func');
      salesSave?.addEventListener('click', async function () {
        const dt = salesNavScrappedItems.value.filter(
          (e: any) =>
            (e.emailAddress && e.emailAddress.length > 0) ||
            (e.phoneNumbers && e.phoneNumbers.length > 0),
        );
        salesNavScrappedItems.value = dt;
        if (dt.length > 0) {
          scrapeSelectedItemsCount.value = 1;
          saveSalesContactInfo(true, 0, dt[0]);
        } else {
          return toast.info('Please get the enriched contact ');
        }
      });
    }

    const pushToCrm = document.getElementById('kps_sales_push_to_crm');
    if (!pushToCrm?.classList.contains('kps-func')) {
      pushToCrm?.classList.add('kps-func');
      pushToCrm?.addEventListener('click', async function () {
        if (salesNavselectedItems.value.length > 0) {
          console.log('pushToCrm ', salesNavScrappedItems.value);
          appData.updateCEVisible(true);

          var modal = document.getElementById('selectCrm');
          modal?.classList.add('show');
          //@ts-ignore
          modal.style.display = 'block';
          document.body.classList.add('modal-open');
          var closeModalButtons = document.querySelectorAll(
            '[data-bs-dismiss="modal"]',
          );
          closeModalButtons.forEach(function (button) {
            button.addEventListener('click', function () {
              var modal = document.getElementById('selectCrm');
              //@ts-ignore
              modal.classList.remove('show');
              //@ts-ignore
              modal.style.display = 'none';
              document.body.classList.remove('modal-open');
            });
          });
        }
      });
    }

    const addToList = document.getElementById('kps_sales_add_to_list');
    if (!addToList?.classList.contains('kps-func')) {
      addToList?.classList.add('kps-func');
      addToList?.addEventListener('click', async function () {
        if (salesNavselectedItems.value.length > 0) {
          appData.updateCEVisible(true);
          console.log('addToList ', salesNavScrappedItems.value);
          addToListFunc();
        }
      });
    }
  }
};
const uploadCRM = async (ef: any) => {
  isLoading.value = true;
  const items = salesNavScrappedItems.value.map((e: any) => e.enrichId);
  console.log('items', items);
  const savedRes = await saveToCRMContact(ef, items);
  console.log('crm ', savedRes);
  isLoading.value = false;
  const modal = document.getElementById('selectCrm');
  //@ts-ignore
  modal.classList.remove('show');
  //@ts-ignore
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
  if (!savedRes) {
    return toast.info(
      'Please complete integration at kompassai.com/integrate.',
    );
  } else {
    return toast.success('uploaded successfully');
  }
};
const scrappedItemClicked = async (ef: any) => {
  setTimeout(function () {
    let checked = true;
    let checkedCount = 0;
    for (let i = 0; i < scrappedData.value.length; i++) {
      const dd = scrappedData.value[i];
      // console.log(i, dd, dd.checked)
      if (dd.checked) {
        checkedCount++;
      } else {
        checked = false;
      }
    }
    scrapeSelectedItemsCount.value = checkedCount;
    salesNavSelectALL.value = checked;
  }, 100);
};
// select all click
const selectAllCheckboxClick = async (e: any) => {
  if (e.target.checked) {
    const dt: any = [];
    scrappedData.value.forEach((element: any) => {
      element.checked = true;
      dt.push(element);
    });
    scrappedData.value = dt;
    scrapeSelectedItemsCount.value = dt.length;
  } else {
    const dt: any = [];
    scrappedData.value.forEach((element: any) => {
      element.checked = false;
      dt.push(element);
    });
    scrappedData.value = dt;
    scrapeSelectedItemsCount.value = 0;
  }
};

const selectAllClick = async (e: any) => {
  if (e.target.checked) {
    const dt: any = [];
    salesNavScrappedItems.value.forEach((element: any) => {
      element.checked = true;
      dt.push(element);
    });
    salesNavScrappedItems.value = dt;
    scrapeSelectedItemsCount.value = dt.length;
  } else {
    const dt: any = [];
    salesNavScrappedItems.value.forEach((element: any) => {
      element.checked = false;
      dt.push(element);
    });
    salesNavScrappedItems.value = dt;
    scrapeSelectedItemsCount.value = 0;
  }
};

const leadLoadingSet = async (e: any) => {
  isLoading.value = e;
};
const contactSelect = async (e: any) => {
  companyClickedItem.value = '';
  contactClickedItem.value = '';
  selectedleads.value = e;
};
const salesNavScrapped = async (e: any) => {
  if (e && e.length > 0) {
    const pushToCrm = document.getElementById('kps_sales_push_to_crm');
    const addToList = document.getElementById('kps_sales_add_to_list');
    if (pushToCrm) {
      pushToCrm.style.display = 'flex';
    }
    if (addToList) {
      addToList.style.display = 'flex';
    }
  }
};
watchEffect(() => companyDataUpdated(companyData));
watchEffect(() => contactInfoUpdated(contactInfo));
watchEffect(() => scrapingResult(salesData.value));
watchEffect(() => searchingHistory(searchText.value));
watchEffect(() => scrapingDoneResult(scrapingDone.value));
watchEffect(() => scrapinglimits(dlimits.value));
watchEffect(() => selectedListOptionChange(selectedListOption.value));
watchEffect(() => selectedContactsTitleChange(selectedContactsTitle.value));
watchEffect(() => searchingContacts(contactSearchFilterText.value));
watchEffect(() => searchingCompanies(contactSearchFilterText.value));
watchEffect(() => totalUpdate(salesTotal.value));
watchEffect(() => scrapeCountsUpdate(scrapeCounts.value));
watchEffect(() => salesNavScrapped(salesNavScrappedItems.value));
// from profile page - email, phone, contacts
watchEffect(() => commandChanges(commands.value));
watchEffect(() => btnAddedChanges(btnAdded.value));

const imgUrl: any = computed(() => chrome.runtime.getURL(`logo.svg`));
const maximize = computed(() => chrome.runtime.getURL(`maximize.svg`));
const bookmark_border = computed(() =>
  chrome.runtime.getURL(`bookmark_border.svg`),
);
const companyImg = computed(() => chrome.runtime.getURL(`company.svg`));
const linkedIn = computed(() => chrome.runtime.getURL(`LinkedIn.svg`));
const link = computed(() => chrome.runtime.getURL(`link.svg`));
const refreshIcon = computed(() => chrome.runtime.getURL(`refresh.svg`));
const checkmarkIcon = computed(() => chrome.runtime.getURL(`CheckmarkCircle16Regular.svg`));
const warningIcon = computed(() => chrome.runtime.getURL(`Warning20Regular.svg`));
const errorIcon = computed(() => chrome.runtime.getURL(`ErrorOutlineSharp.svg`));

const bookmark_border1 = computed(() =>
  chrome.runtime.getURL(`bookmark_border1.svg`),
);
const searchIcon = computed(() => chrome.runtime.getURL(`search.svg`));
const person = computed(() => chrome.runtime.getURL(`person.svg`));
const assistant_photo = computed(() =>
  chrome.runtime.getURL(`assistant_photo.svg`),
);
const fmd_good = computed(() => chrome.runtime.getURL(`fmd_good.svg`));
const watch_later = computed(() => chrome.runtime.getURL(`watch_later.svg`));
const google_login = computed(() => chrome.runtime.getURL(`google-login.svg`));
const chevron_left = computed(() => chrome.runtime.getURL(`chevron_left.svg`));
const keyboard_arrow_right = computed(() =>
  chrome.runtime.getURL(`keyboard_arrow_right.svg`),
);
const keyboard_arrow_up = computed(() =>
  chrome.runtime.getURL(`keyboard_arrow_up.svg`),
);
const filter_alt = computed(() => chrome.runtime.getURL(`filter_alt.svg`));
const bookmark = computed(() => chrome.runtime.getURL(`bookmark.svg`));
const update = computed(() => chrome.runtime.getURL(`update.svg`));
const k_brand = computed(() => chrome.runtime.getURL(`k_brand.svg`));
const linkedin = computed(() => chrome.runtime.getURL(`linkdin.svg`));
const toc = computed(() => chrome.runtime.getURL(`toc.svg`));
const arrow_circle_left = computed(() =>
  chrome.runtime.getURL(`arrow_circle_left.svg`),
);
const arrow_circle_right = computed(() =>
  chrome.runtime.getURL(`arrow_circle_right.svg`),
);
const integration_instructions = computed(() =>
  chrome.runtime.getURL(`integration_instructions.svg`),
);
const supervisor_account = computed(() =>
  chrome.runtime.getURL(`supervisor_account.svg`),
);
const right_url = computed(() => chrome.runtime.getURL(`right_url.svg`));
const domain = computed(() => chrome.runtime.getURL(`domain.svg`));
const attach_money = computed(() => chrome.runtime.getURL(`attach_money.svg`));
const home_work = computed(() => chrome.runtime.getURL(`home_work.svg`));
const nonephoto = computed(() => chrome.runtime.getURL(`none.svg`));
</script>

<style scoped>
@import './AppStyles.css';
@import './NavStyles.css';
</style>
